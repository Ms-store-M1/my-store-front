export async function getOrders(take) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order?take=${take}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching orders:", err);
        return { error: "An error occurred while fetching orders." };
    }
}

export async function getOrder(orderId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error('Failed to fetch order');
        }
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Error fetching order:", err);
        return { error: "An error occurred while fetching order." };
    }
}

export async function addOrder(userId, order) {
    const _body = {
        userId: userId,
        orderId: order.orderId,
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/add`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_body),
        });
        if (!res.ok) {
            throw new Error('Failed to add order');
        }
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Error adding order:", err);
        return { error: "An error occurred while adding order." };
    }
}

export async function removeOrder(orderId) {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/delete/${orderId}`, {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            throw new Error('Failed to delete order');
        }
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error("Error deleting orders:", err);
        return { error: "An error occurred while deleting order." };
    }
}
