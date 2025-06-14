"use client";

import { useTransition } from "react";

import { Order, OrderItem } from "@/types";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  updateOrderToDelivered,
} from "@/lib/actions/order.actions";
import {toast} from "sonner";
import StripePayment from "./stripe-payment";

interface OrderDetailsTableProps {
    order: Order;
    stripeClientSecret: string | null;
    payPalClientId: string;
    isAdmin?: boolean;
}

const OrderDetailsTable = ({
    order,
    payPalClientId,
    isAdmin = false,
    stripeClientSecret,
}: OrderDetailsTableProps) => {
    const {
        id,
        shippingAddress,
        orderItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        isDelivered,
        paidAt,
        deliveredAt,
    } = order;

    const PrintLoadingState = () => {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();

        let status;
        if (isPending) {
            status = "Loading PayPal...";
        } else if (isRejected) {
            status = "Error loading PayPal";
        } else {
            status = ""
        }

        return status;
    };

    const handleCreatePayPalOrder = async () => {
        const resp = await createPayPalOrder(id);
        if (!resp.success) {
            toast.error(resp.message, {
                style: {
                    backgroundColor: "red",
                    color: "white"
                }
            })
        }
        return resp.data;
    };

    const handleApprovePayPalOrder = async (
        data: { orderID: string }
    ) => {
        const resp = await approvePayPalOrder(id, {orderId: data.orderID});
        if (!resp.success) {
            toast.error(resp.message, {
                style: {
                    backgroundColor: "red",
                    color: "white"
                }
            })
            return;
        }
        toast.success(resp.message);
        return;
    };

    const MarkAsPaid = () => {
      const [isPending, startTransition] = useTransition();

      return (
        <Button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(async () => {
            const resp = await updateOrderToPaidCOD(id);
            if (!resp.success) {
                toast.error(resp.message, {
                    style: {
                        backgroundColor: "red",
                        color: "white"
                    }
                })
            } else {
              toast.success(resp.message);
            }
          })}
        >
          {isPending ? "Processing..." : "Mark as Paid"}
        </Button>
      );
    };

    const MarkAsDelivered = () => {
      const [isPending, startTransition] = useTransition();

      return (
        <Button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(async () => {
            const resp = await updateOrderToDelivered(id);
            if (!resp.success) {
              toast.error(resp.message, {
                style: {
                  backgroundColor: "red",
                  color: "white"
                }
              })
            } else {
              toast.success(resp.message);
            }
          })}
        >
          {isPending ? "Processing..." : "Mark as Delivered"}
        </Button>
      );
    };

    return (
        <>
            <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="col-span-2 space-y-4 overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p className="mb-2">{paymentMethod}</p>
                            { isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Not Paid
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">
                                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                            { isDelivered ? (
                                <Badge variant="secondary">
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    Not Delivered
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(orderItems || []).map((item: OrderItem, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Link href={`/products/${item.slug}`} className="flex items-center">
                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{item.qty}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${Number(item.price).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{ formatCurrency(itemsPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{ formatCurrency(taxPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{ formatCurrency(shippingPrice) }</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{ formatCurrency(totalPrice) }</div>
                            </div>
                            {!isPaid && paymentMethod === "PayPal" && (
                                <div>
                                    <PayPalScriptProvider options={{ clientId: payPalClientId }}>
                                        <PrintLoadingState />
                                        <PayPalButtons
                                            createOrder={handleCreatePayPalOrder}
                                            onApprove={handleApprovePayPalOrder}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}
                            {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                              <StripePayment
                                priceInCents={Number(order.totalPrice) * 100}
                                orderId={order.id}
                                clientSecret={stripeClientSecret}
                              />
                            )}
                          {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                            <MarkAsPaid />
                          )}
                          {isAdmin && isPaid && !isDelivered && (
                            <MarkAsDelivered />
                          )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default OrderDetailsTable;
