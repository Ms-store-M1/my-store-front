"use client"

import { getCart, clearCart, updateCartItemQuantity, removeProductFromCart, addToCart } from "@/services/api/cart.api";
import useAuthStore from "@/stores/authStore"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handlePayment } from "@/services/api/stripe.api";

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

    const increaseQuantity = async (product) => {
        console.log(product);
        if (!isLogged) {
            const updatedCart = cart.map(item => {
                if (item.productId === product.productId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const _body = {
                productId: product.productId,
                quantity: product.quantity + 1,
            }
            const response = await updateCartItemQuantity(accountInfo.id, _body);
            if (response) {
                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });
                setCart(updatedCart);
            }
        }
    };

    const decreaseQuantity = async (product) => {
        if (!isLogged) {
            if (product.quantity === 1) {
                    const updatedCart = cart.filter(item => item.productId !== product.productId);
                    setCart(updatedCart);
                    localStorage.setItem('cart', JSON.stringify(updatedCart));
            } else {
                const updatedCart = cart.map(item => {
                    if (item.productId === product.productId && item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });
                setCart(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
        } else {
            if (product.quantity === 1) {
                const response = await removeProductFromCart(accountInfo.id, product.productId);
                if (response) {
                    const updatedCart = cart.filter(item => item.productId !== product.productId);
                    setCart(updatedCart);
                }
            } else {
                const _body = {
                    productId: product.productId,
                    quantity: product.quantity - 1,
                }
                const response = await updateCartItemQuantity(accountInfo.id, _body);
                if (response) {
                    const updatedCart = cart.map(item => {
                        if (item.productId === product.productId && item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        return item;
                    });
                    setCart(updatedCart);
                }
            }
        }

    };

    const handleCheckoutClick = async () => {
        if (!cart) {
            console.error('Aucun article dans le panier');
            return;
        }
        const result = await handlePayment(cart);
        if (result.error) {
            console.error('Erreur de paiement', result.error);
        } else {
            window.location.href = result.url;
        }
    };

    return (
        <div className="min-h-screen w-full px-2 bg-gray-50">
            <div className="flex justify-between my-2">
                <h1 className="text-3xl font-bold pt-2 pl-2">monpanier.</h1>
                {
                    cart.length > 0 && (
                        <button
                            onClick={() => handleCheckoutClick()}
                            className="p-2 border border-black-500"
                        >
                            Commander avec Stripe
                        </button>
                    )
                }
            </div>
            <div>
                {
                    cart.length > 0 ? (
                        <div>
                            {
                                cart.map((item) => {
                                    return (
                                        <div key={item.productId} className="flex items-center justify-between p-2 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <img src={item.product.thumbnail} alt={item.product.name} className="w-20 h-20 object-cover" />
                                                <div className="ml-2">
                                                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                                                    <p className="text-sm text-gray-500">{item.product.price} €</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => decreaseQuantity(item)}
                                                    className="px-2 py-1 bg-gray-200">
                                                    -
                                                </button>
                                                <span className="px-2 py-1">{item.quantity}</span>
                                                <button
                                                    onClick={() => increaseQuantity(item)}
                                                    className="px-2 py-1 bg-gray-200">
                                                    +
                                                </button>
                                            </div>
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
            </div>
        </div>
    )
}
