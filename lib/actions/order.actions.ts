"use server"

import {isRedirectError} from "next/dist/client/components/redirect-error";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {auth} from "@/auth-server";
import {getMyCart} from "@/lib/actions/cart.actions";
import {getUserById} from "@/lib/actions/user.actions";
import {insertOrderSchema} from "@/lib/validators";
import {prisma} from "@/db/prisma";
import {CartItem} from "@/types";

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            orderItem: true,
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
