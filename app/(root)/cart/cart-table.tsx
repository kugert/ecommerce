"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/utils";

import { Cart } from "@/types";

interface CartTableProps {
    cart?: Cart;
}

const CartTable = ({
    cart,
}: CartTableProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const decreaseItemQuantity = async (itemId: string) => {
        const res = await removeItemFromCart(itemId)

        if (!res.success) {
            toast.error(res.message, {
                style: {
                    backgroundColor: "red",
                    color: "white"
                }
            })
        }
    };

    const increaseItemQuantity = async (item: {
        productId: string
        name: string
        slug: string
        qty: number
        image: string
        price: string
    }) => {
        const res = await addItemToCart(item)

        if (!res.success) {
            toast.error(res.message, {
                style: {
                    backgroundColor: "red",
                    color: "white"
                }
            })
        }
    };

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty.{" "}
                    <Link href="/" className="underline underline-offset-4">Go shopping.</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                { cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link
                                                href={`/products/${item.slug}`}
                                                className="flex items-center"
                                            >
                                                <Image src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="flex-center gap-2">
                                            <Button
                                                disabled={isPending}
                                                variant="outline"
                                                type="button"
                                                onClick={() => (
                                                    startTransition(
                                                        async () => decreaseItemQuantity(item.productId)
                                                    )
                                                )}
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Minus className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <span>{item.qty}</span>
                                            <Button
                                                disabled={isPending}
                                                variant="outline"
                                                type="button"
                                                onClick={() => (
                                                    startTransition(
                                                        async () => increaseItemQuantity(item)
                                                    )
                                                )}
                                            >
                                                {isPending ? (
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Card>
                        <CardContent className="p-4 gap-4">
                            <div className="pb-3 text-xl">
                                Subtotal ({ cart.items.reduce(
                                (a, c) => a + c.qty, 0
                            )}):
                                <span className="font-bold">
                                    { formatCurrency(cart.itemsPrice) }
                                </span>
                            </div>
                            <Button
                                className="w-full"
                                disabled={isPending}
                                onClick={() => (
                                    startTransition(
                                        () => router.push("/shipping-address")
                                    )
                                )}
                            >
                                {isPending ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )} Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}

export default CartTable;
