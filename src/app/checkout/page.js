"use client"

import { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { handlePayment } from "@/services/api/stripe.api";
import useAuthStore from "@/stores/authStore";
import { getCart } from "@/services/api/cart.api";

export default function Checkout() {

    const { isLogged, accountInfo } = useAuthStore();
    const [cart, setCart] = useState(null); 
    const [deliveryMethod, setDeliveryMethod] = useState('inStore'); // 'inStore' ou 'homeDelivery'
    const [address, setAddress] = useState('');
    const stripePromise = loadStripe('pk_test_51OwjAj02i32qXvQWs3V6rnNhzZrWn3PCbbIqOK7t9tnfyBqqnk2EwTmHyaTm1KdegFoJcFUzNJukGppwgY2i8zD600kExRM1gp');

    useEffect(() => {
        if (isLogged) {
            getCart(accountInfo.id).then(cartData => {
                setCart(cartData);
            });
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
                <h1 className="text-3xl font-bold">Récapitulatif de ma commande</h1>
            </div>
            <div className="space-y-4 w-1/2 m-auto">
                <div>
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="radio"
                            value="inStore"
                            checked={deliveryMethod === 'inStore'}
                            onChange={() => setDeliveryMethod('inStore')}
                            className="text-black border-gray-300"
                        />
                        <span>Retrait en magasin</span>
                    </label>
                </div>
                <div>
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="radio"
                            value="homeDelivery"
                            checked={deliveryMethod === 'homeDelivery'}
                            onChange={() => setDeliveryMethod('homeDelivery')}
                            className="text-black border-gray-300"
                        />
                        <span>Livraison à domicile</span>
                    </label>
                </div>
                {deliveryMethod === 'homeDelivery' && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Votre adresse de livraison:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                )}
                <button
                    onClick={handleCheckoutClick} // Appel de la fonction de paiement
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                    Payer avec Stripe
                </button>
            </div>
        </div>
    )

}