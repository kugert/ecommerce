import Stripe from "stripe";
import {getOrderById} from "@/lib/actions/order.actions";
import {notFound, redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const StripePaymentSuccessPage = async (props: {
  params: Promise<{ id: string; }>,
  searchParams: Promise<{ payment_intent: string; }>,
}) => {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  const order = await getOrderById(id);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) notFound();

  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(`/orders/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/orders/${id}`}>
            View Order
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default StripePaymentSuccessPage;
