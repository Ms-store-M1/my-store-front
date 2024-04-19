import Link from "next/link";
import { getOrders, getOrdersOfUser } from "@/services/api/order.api.js";
import { getUser } from "@/services/api/user.api.js";
import Alert from "@/components/UI/Alert";
import OrdersGrid from "@/components/orders/OrdersGrid";
import TitlePage from "@/components/UI/TitlePage";
import OrdersCounter from "@/components/orders/OrdersCounter";

export default async function Page({
    searchParams,
    userId,
}) {
    //const isAdmin = checkIfUserIsAdmin(context);
    const isAdmin = true;
    const { take = 8, user: requestedUserId } = searchParams || {};

    try {
        let orders;
        let users = {};
        
        if (isAdmin && requestedUserId) {
            orders = await getOrdersOfUser(requestedUserId, take);
            users[requestedUserId] = await getUser(requestedUserId);
        } else if (isAdmin) {
            orders = await getOrders(take);
            // Fetch user data for each order
            for (const order of orders) {
                // Only fetch user data if it hasn't been fetched before
                if (!users[order.userId]) {
                    users[order.userId] = await getUser(order.userId);
                }
            }
        } else {
            orders = await getOrdersOfUser(userId);
            users[userId] = await getUser(userId);
        }

        if (!requestedUserId) {
            // Extract userIds from orders
            const userIds = orders.map(order => order.userId);
            // Fetch user data for each userId
            for (const userId of userIds) {
                // Only fetch user data if it hasn't been fetched before
                if (!users[userId]) {
                    users[userId] = await getUser(userId);
                }
            }
        } else {
            // Fetch user data for requestedUserId if it hasn't been fetched before
            if (!users[requestedUserId]) {
                users[requestedUserId] = await getUser(requestedUserId);
            }
        }

        if (!orders || orders.length === 0) {
            return <Alert message="No orders found." type="info" />;
        }
    
        return (
            <div className="container mx-auto">
                <TitlePage title="Liste des commandes des clients" />
                <OrdersCounter ordersLength={orders.length} />
                <OrdersGrid orders={orders} users={users} isAdmin={isAdmin} />
                <div className="flex justify-center mb-24">
                    {
                        Number(take) <= orders.length && (
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