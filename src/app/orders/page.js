import Link from "next/link";
import { getOrders, getOrdersOfUser } from "@/services/api/order.api.js";
import Alert from "@/components/UI/Alert";
import OrdersGrid from "@/components/orders/OrdersGrid";
import TitlePage from "@/components/UI/TitlePage";
import OrdersCounter from "@/components/orders/OrdersCounter";

export default async function Page({
    searchParams,
    userId,
}) {
    //const isAdmin = checkIfUserIsAdmin(context);
    const isAdmin = false;
    const { take = 8, user: requestedUserId } = searchParams || {};

    try {
        let orders;
        if (isAdmin && requestedUserId) {
            orders = await getOrdersOfUser(requestedUserId, take);
        } else if (isAdmin) {
            orders = await getOrders(take);
        } else {
            orders = await getOrdersOfUser(userId);
        }

        if (!orders.data || orders.success === false) {
            return <Alert message={orders.message || "Failed to fetch orders."} type="error" />;
        }
    
        return (
            <div className="container mx-auto">
                <TitlePage title="Liste des commandes des clients" />
                <OrdersCounter ordersLength={orders.data.length} />
                <OrdersGrid orders={orders.data} isAdmin={isAdmin} />
                <div className="flex justify-center mb-24">
                    {
                        Number(take) <= orders.data.length && (
                            <Link
                                className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                                href={`/orders?take=${(Number(take) + 8)}`}
                            >
                                See more
                            </Link>
                        )
                    }
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return <Alert message="An error occurred while fetching orders." type="error" />;
    }
}