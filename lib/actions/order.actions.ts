"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { auth } from "@/auth-server";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { insertOrderSchema } from "@/lib/validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "@/lib/constants";

export async function createOrder(){
    try {
        const session = await auth();
        if (!session) throw new Error("User is not authenticated");

        const cart = await getMyCart();

        const userId = session?.user?.id;
        if (!userId) throw new Error("User not found");

        const user = await getUserById(userId);

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: "Cart is empty",
                redirectTo: "/cart",
            };
        }
        if (!user.address) {
            return {
                success: false,
                message: "No shipping address found",
                redirectTo: "/shipping-address",
            };
        }
        if (!user.paymentMethod) {
            return {
                success: false,
                message: "No payment method found",
                redirectTo: "/payment-method",
            };
        }

        const orderData = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        const orderId= await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({data: orderData});

            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: order.id,
                    },
                })
            }

            await tx.cart.update({
                where: {id: cart.id},
                data: {
                    items: [],
                    itemsPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    totalPrice: 0,
                },
            });

            return order.id;
        });

        if (!orderId) throw new Error("Order not created");

        return {
            success: true,
            message: "Order created successfully",
            redirectTo: `/orders/${orderId}`,
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error),
        };
    }
}

export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {id: orderId},
        include: {
            orderItems: true,
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },
    });

    return convertToPlainObject(data);
}

// Create a new PayPal order
export async function createPayPalOrder(orederId: string) {
    try {
        const order = await getOrderById(orederId);
        if (!order) throw new Error("Order not found");

        const payPalOrder = await paypal.createOrder(Number(order.totalPrice));

        await prisma.order.update({
            where: {id: order.id},
            data: {
                paymentResult: {
                    id: payPalOrder.id,
                    email_address: payPalOrder.emailAddress,
                    status: "",
                    pricePaid: 0,
                },
            },
        });
        return {
            success: true,
            message: "Item order created successfully on PayPal",
            data: payPalOrder.id,
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

// Approve PayPal order and update order to paid
export async function approvePayPalOrder(
    orderId: string,
    data: {orderId: string},
) {
    try {
        const order = await getOrderById(orderId);
        if (!order) throw new Error("Order not found");

        const captureData = await paypal.capturePayment(data.orderId);
        if (
            !captureData
            || captureData.id !== (order.paymentResult as PaymentResult).id
            || captureData.status !== "COMPLETED"
        ) {
            throw new Error("Payment capture failed");
        }

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            }
        });

        revalidatePath(`/orders/${orderId}`);

        return {
            success: true,
            message: "Your order has been paid successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

async function updateOrderToPaid({
    orderId,
    paymentResult,
}: {
    orderId: string;
    paymentResult?: PaymentResult;
}) {
    const order = await prisma.order.findFirst({
        where: {id: orderId},
        include: {
            orderItems: true,
        },
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order is already paid");

    await prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: {id: item.productId},
                data: {
                    stock: { increment: -item.qty },
                },
            });
        }
        await tx.order.update({
            where: {id: order.id},
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult,
            },
        });
    });

    const updatedOrder = await prisma.order.findFirst({
        where: {id: orderId},
        include: {
            orderItems: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!updatedOrder) throw new Error("Order not found");
}

// Get user orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page = 1,
}: {
  limit?: number;
  page: number;
}) {
   const session = await auth();
   if (!session) throw new Error("User is not authenticated");

   const data = await prisma.order.findMany({
     where: { userId: session?.user?.id },
     take: limit,
     skip: (page - 1) * limit,
     orderBy: { createdAt: "desc" },
   });

   const dataCount = await prisma.order.count({
     where: { userId: session?.user?.id },
   });

   return {
     data,
     totalPages: Math.ceil(dataCount / limit),
   }
}
