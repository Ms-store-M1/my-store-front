"use client"

import { useState, useEffect } from "react";
import { handlePayment } from "@/services/api/stripe.api";
import useAuthStore from "@/stores/authStore";
import { getCart } from "@/services/api/cart.api";

export default function Checkout() {

    const { isLogged, accountInfo } = useAuthStore();
    const [cart, setCart] = useState(null); 
    

    useEffect(() => {
        if (isLogged) {
            getCart(accountInfo.id).then(cartData => {
                setCart(cartData);
                if (cartData) {
                    payement(cartData);
                }
            });
        }

        const payement = async (cartData) => {
            const result = await handlePayment(cartData);
            if (result.error) {
                console.error('Erreur de paiement', result.error);
            } else {
                window.location.href = result.url;
            }
        }
    }, [isLogged, accountInfo.id]);

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
        <div className="min-h-screen w-full p-4 bg-white">
            <div className="my-4">
                <h1 className="text-3xl font-bold">Lancement de votre paiement...</h1>
            </div>
            <div className="space-y-4 w-1/2 ">
                <button
                    onClick={handleCheckoutClick} // Appel de la fonction de paiement
                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 bg-white"
                    >
                    Cliquez ici si votre payement ne s'ouvre pas automatiquement.
                </button>
            </div>
        </div>
    )

}