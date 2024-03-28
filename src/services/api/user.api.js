export async function createUser(user) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/create`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function loginUser(user) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
            method: "POST",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await res.json();
        console.log('okok',data)
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function fetchUsers(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function getUser(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function updateUser(user) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/update/${user.id}`, {
            method: "PUT",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function deleteUser(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/delete/${id}`, {
            method: "DELETE",
            cache: "no-store",
        });
        const data = await res.json();
        console.log("Delete user response:", data); // TEST Vérifie la réponse du backend dans la console
        return data;
    } catch (err) {
        return err;
    }
}

export async function addToWishlist(userId, productId) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/wishlist/${productId}`, {
            method: "POST",
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}