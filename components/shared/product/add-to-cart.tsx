"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner";

import {Cart, CartItem} from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

interface AddToCartProps {
    item: CartItem,
    cart?: Cart,
}

const AddToCart = ({
    item,
    cart,
}: AddToCartProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAddToCart = async () => {
        startTransition(async () => {
            const response = await addItemToCart(item);

            if (!response.success) {
                toast.error(response.message, {
                    style: {
                        backgroundColor: "red",
                        color: "white"
                    }
                })
                return;
            }

            toast(response.message, {
                description: "",
                className: "bg-primary text-white hover:bg-gray-600",
                action: {
                    label: "Go to Cart",
                    onClick: () => router.push("/cart"),
                },
            });
        });
    }

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const response = await removeItemFromCart(item.productId);

            if (!response.success) {
                toast.error(response.message, {
                    style: {
                        backgroundColor: "red",
                        color: "white"
                    }
                })
                return;
            }

            toast.success(response.message);
            return;
        });
    };

    const existingItem = cart && cart.items
        .find((x) => x.productId === item.productId);

    return existingItem ? (
        <div>
            <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="h-4 w-4"/>}
            </Button>
            <span className="px-2">{ existingItem.qty }</span>
            <Button type="button" variant="outline" onClick={handleAddToCart}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="h-4 w-4"/>}
            </Button>
        </div>
        ) : (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="h-4 w-4"/>} Add to Cart
        </Button>
    );
};

export default AddToCart;