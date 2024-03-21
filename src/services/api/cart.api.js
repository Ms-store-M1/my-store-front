export async function getCart(userId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`, {
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

export async function addToCart(userId, cart) {

    const _body = {
        userId: userId,
        productId: cart.productId,
        quantity: cart.quantity,
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/add`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_body),
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function updateCartItemQuantity(userId, cart) {

    const _body = {
        userId: userId,
        productId: cart.productId,
        quantity: cart.quantity,
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`, {
            method: "PUT",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(_body),
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function removeProductFromCart(userId, productId) {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/delete/${userId}/${productId}`, {
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

export async function clearCart(userId) {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear/${userId}`, {
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