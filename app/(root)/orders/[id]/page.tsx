import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Order } from "@/types";
import OrderDetailsTable from "./order-details-table"

export const metadata: Metadata = {
    title: "Order details",
}

const OrderDetailsPage = async (props: {
    params: Promise<{
        id: string;
    }>
}) => {
    const { id } = await props.params;

    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <>
            <OrderDetailsTable order={order as unknown as Order} />
        </>
    );
}

export default OrderDetailsPage;
