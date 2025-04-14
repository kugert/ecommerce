"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderForm = () => {
    const router = useRouter();

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} className="w-full">
                {pending ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Check className="mr-2 h-4 w-4" />
                )}
                Place Order
            </Button>
        )
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const res = await createOrder();
        if (res.redirectTo) {
            router.push(res.redirectTo);
        }
        return;
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <PlaceOrderButton />
        </form>
    );
}

export default PlaceOrderForm;
