"use client"

import { getCart, clearCart, updateCartItemQuantity, removeProductFromCart, addToCart } from "@/services/api/cart.api";
import useAuthStore from "@/stores/authStore"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Cart() {

    const { isLogged, accountInfo, checkLogin } = useAuthStore();
    const [cart, setCart] = useState([]); // [ { productId: 1, product: {}, quantity: 1 }
    const [authChecked, setAuthChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLogin = async () => {
            try {
                await checkLogin();
            } catch (err) {
                console.log(err);
            } finally {
                setAuthChecked(true);
            }
        };
        fetchLogin();
    }, []);

    useEffect(() => {
        if (authChecked) {
            if (!isLogged) {
                const getCartFromLocalStorage = () => {
                    const localCart = localStorage.getItem("cart");
                    if (localCart) {
                        const cartArray = JSON.parse(localCart);
                        setCart(cartArray);
                    }
                    setLoading(false);
                };
                getCartFromLocalStorage();
            } else {

                // fetchCart();
            }
        }
    }, [authChecked, isLogged]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];

            if (localCart.length > 0) {
                await clearCart(accountInfo.id);

                const addToCartPromises = localCart.map(el => {
                    const newItem = {
                        productId: el.productId,
                        quantity: el.quantity,
                    };
                    return addToCart(accountInfo.id, newItem);
                });

                await Promise.all(addToCartPromises);
            }
            localStorage.removeItem("cart");
            const updatedCart = await getCart(accountInfo.id);
            if (updatedCart) {
                setCart(updatedCart);

            } else {
                setCart([]);
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du panier:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement...</p>
            </div>
        );
    } else {

    }

    return (
        <div className="min-h-screen w-full px-2 bg-gray-50">
            <div className="flex justify-between my-2">
                <h1 className="text-3xl font-bold pt-2 pl-2">merci pour votre commande.</h1>
            </div>
        </div>

    )
}
