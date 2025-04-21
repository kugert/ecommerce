import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Order } from "@/types";
import OrderDetailsTable from "./order-details-table"
import {auth} from "@/auth-server";
import Stripe from "stripe";

export const metadata: Metadata = {
    title: "Order details",
}

const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string;
    }>
}) => {
    const { id } = await props.params;
    const session = await auth();

    let client_secret = null;

    const order = await getOrderById(id);
    if (!order) notFound();

    if (order.paymentMethod === "Stripe" && !order.isPaid) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalPrice) * 100),
        currency: "usd",
        metadata: { orderId: order.id },
      });
      client_secret = paymentIntent.client_secret;
    }

    return (
        <>
            <OrderDetailsTable
                order={order as unknown as Order}
                stripeClientSecret={client_secret}
                payPalClientId={process.env.PAYPAL_APP_CLIENT_ID || "sb"}
                isAdmin={session?.user?.role === "admin" || false}
            />
        </>
    );
}

export default OrderDetailsPage;
