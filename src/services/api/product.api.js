export async function getProducts(take) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?take=${take}`,
            {
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}

export async function getAllProducts() {
    console.log("getAllProducts");
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/admin`,
            {
                cache: "no-store",
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}

export async function fetchProducts() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
            {
                cache: "no-store",
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}

export async function getProduct(id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
            {
                cache: "no-store",
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}

export async function updateProduct(id, active) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
            {
                method: "PUT",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(active),
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}

export async function deleteProduct(id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
            {
                method: "DELETE",
                cache: "no-store",
            }
        );
        const data = await res.json();
        return data;
    } catch (err) {
        return err;
    }
}
