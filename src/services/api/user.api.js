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
        return data;
    }
    catch (err) {
        return err;
    }
}

export async function fetchUsers() {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.id}`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`, {
            method: "DELETE",
            cache: "no-store",
        });
        const data = await res.json();
        return data;
    }
    catch (err) {
        return err;
    }
}