export async function getProductsFromOrder(orderId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productOrders/${orderId}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function addToOrder(orderId, productOrders) {
    try {
        const _body = {
            orderId: orderId,
            productId: productOrders.productId,
            quantity: productOrders.quantity,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productOrders/add`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_body),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error adding product to order:", error);
        throw new Error("Failed to add product to order");
    }
}

export async function removeProductFromOrder(orderId, productId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productOrders/delete/${orderId}/${productId}`, {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error removing product from order:", error);
        throw new Error("Failed to remove product from order");
    }
}

export async function updateProductQuantityInOrder(orderId, productOrders) {
    try {
        const _body = {
            orderId: orderId,
            productId: productOrders.productId,
            quantity: productOrders.quantity,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productOrders/update/${orderId}/${productId}`, {
            method: "PUT",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_body),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating product quantity in order:", error);
        throw new Error("Failed to update product quantity in order");
    }
}

export async function clearProductsFromOrder(orderId) {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productOrder/clear/${orderId}`, {
            method: "DELETE",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}