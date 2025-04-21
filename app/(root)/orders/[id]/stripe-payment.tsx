import {FormEvent, useState} from "react";

import { loadStripe } from "@stripe/stripe-js";
import {Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {formatCurrency} from "@/lib/utils";
import {SERVER_URL} from "@/lib/constants";

interface StripePaymentProps {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: StripePaymentProps) => {
  const { theme } = useTheme();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (stripe === null || elements === null || email === "") {
        setError("Stripe not loaded or email not provided");
        return;
      }

      setIsLoading(true);
      stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/orders/${orderId}/stripe-payment-success`,
        }
      }).then(({error}) => {
        if (error?.type === "card_error" || error?.type === "validation_error") {
          setError(error.message || "An error occurred");
        } else if (error) {
          setError("An unexpected error occurred.");
        }
      }).finally(() => setIsLoading(false));
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {error && (
          <div className="text-destructive">{error}</div>
        )}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={isLoading || stripe === null || elements === null}
        >
          {isLoading ? "Purchasing..." : `Purchase for ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" ? "night" : "stripe",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
}

export default StripePayment;
