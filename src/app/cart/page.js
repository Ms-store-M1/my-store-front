"use client"

import useAuthStore from "@/stores/authStore"
import { useEffect, useState } from "react";

export default function Cart() {

    const { isLogged } = useAuthStore();
    const [cart, setCart] = useState([]); // [ { productId: 1, product: {}, quantity: 1 }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLogged) {
            const getCartFromLocalStorage = () => {
                const localCart = localStorage.getItem("cart");

                if (localCart) {
                    // Parse the cart string back into an array
                    const cartArray = JSON.parse(localCart);
                    setCart(cartArray);
                    setLoading(false);
                } else {
                    // If there's no cart in local storage, just set loading to false
                    setLoading(false);
                }
            };

            getCartFromLocalStorage();
        } else {
            // TODO : Get cart from server
        }
    }, [isLogged]);

    const increaseQuantity = (productId) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (productId) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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
            <div>
                <h1 className="text-3xl font-bold pt-2 pl-2">monpanier.</h1>
                
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
                                                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover" />
                                                <div className="ml-2">
                                                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                                                    <p className="text-sm text-gray-500">{item.product.price} €</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => decreaseQuantity(item.productId)}
                                                    className="px-2 py-1 bg-gray-200">
                                                        -
                                                </button>
                                                <span className="px-2 py-1">{item.quantity}</span>
                                                <button 
                                                    onClick={() => increaseQuantity(item.productId)}
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
