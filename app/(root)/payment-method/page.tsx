import { Metadata } from 'next';
import { auth } from '@/auth-server';
import { getUserById } from "@/lib/actions/user.actions";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: "Select Payment Method",
}

const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("No user not found");

    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    return (
        <>
            <CheckoutSteps current={2} />
            <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
        </>
    );
}

export default PaymentMethodPage;
