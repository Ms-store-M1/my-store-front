"use client";

import {
    getCart,
    clearCart,
    updateCartItemQuantity,
    removeProductFromCart,
    addToCart,
} from "@/services/api/cart.api";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { showToastMessage } from "@/services/toast";

export default function Cart() {
    const { isLogged, accountInfo, checkLogin } = useAuthStore();
    const [cart, setCart] = useState([]); // [ { productId: 1, product: {}, quantity: 1 }
    const [authChecked, setAuthChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchLogin = async () => {
        try {
            await checkLogin();
        } catch (err) {
            console.log(err);
        } finally {
            setAuthChecked(true);
        }
    };

    useEffect(() => {
        fetchLogin();
    }, [checkLogin]);

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
                fetchCart();
            }
        }
    }, [authChecked, isLogged]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];

            if (localCart.length > 0) {
                await clearCart(accountInfo.id);

                const addToCartPromises = localCart.map((el) => {
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

    const increaseQuantity = async (product) => {
        if (!isLogged) {
            const updatedCart = cart.map((item) => {
                if (item.productId === product.productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } else {
            const _body = {
                productId: product.productId,
                quantity: product.quantity + 1,
            };
            const response = await updateCartItemQuantity(
                accountInfo.id,
                _body
            );
            if (response) {
                const updatedCart = cart.map((item) => {
                    if (item.productId === product.productId) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });
                setCart(updatedCart);
                fetchLogin();
                console.log(product);
                showToastMessage(true, 'Produit ajouté au panier');
            }
        }
    };

    const decreaseQuantity = async (product) => {
        if (!isLogged) {
            if (product.quantity === 1) {
                const updatedCart = cart.filter(
                    (item) => item.productId !== product.productId
                );
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            } else {
                const updatedCart = cart.map((item) => {
                    if (
                        item.productId === product.productId &&
                        item.quantity > 1
                    ) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });
                setCart(updatedCart);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }
        } else {
            if (product.quantity === 1) {
                const response = await removeProductFromCart(
                    accountInfo.id,
                    product.productId
                );
                if (response) {
                    const updatedCart = cart.filter(
                        (item) => item.productId !== product.productId
                    );
                    setCart(updatedCart);
                    fetchLogin();
                    showToastMessage(true, 'Produit retiré du panier');
                }
            } else {
                const _body = {
                    productId: product.productId,
                    quantity: product.quantity - 1,
                };
                const response = await updateCartItemQuantity(
                    accountInfo.id,
                    _body
                );
                if (response) {
                    const updatedCart = cart.map((item) => {
                        if (
                            item.productId === product.productId &&
                            item.quantity > 1
                        ) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        return item;
                    });
                    setCart(updatedCart);
                    fetchLogin();
                    showToastMessage(true, 'Produit retiré du panier');
                }
            }
        }
    };

    const handleCheckout = () => {
        if (!isLogged) {
            router.push("/account?from=cart");
        } else {
            router.push("/checkout");
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
                <h1 className="text-3xl font-bold pt-2 pl-2">monpanier.</h1>
                {cart.length > 0 && (
                    <button
                        onClick={() => handleCheckout()}
                        className="p-2 border border-black-500"
                    >
                        Commander
                    </button>
                )}
            </div>
            <div>
                {cart.length > 0 ? (
                    <div>
                        {cart.map((item) => {
                            return (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between p-2 border-b border-gray-200"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={item.product.thumbnail}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover"
                                        />
                                        <div className="ml-2">
                                            <h2 className="text-lg font-semibold">
                                                {item.product.name}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {item.product.price} €
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p>Votre panier est vide.</p>
                        </div>
                    )
                }
            <ToastContainer />
            </div>
        </div>
    );
}
