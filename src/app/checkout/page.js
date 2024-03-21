"use client"

import { useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';


export default function Checkout() {

    const [deliveryMethod, setDeliveryMethod] = useState('inStore'); // 'inStore' ou 'homeDelivery'
    const [address, setAddress] = useState('');
    const stripePromise = loadStripe('pk_test_51OwjAj02i32qXvQWs3V6rnNhzZrWn3PCbbIqOK7t9tnfyBqqnk2EwTmHyaTm1KdegFoJcFUzNJukGppwgY2i8zD600kExRM1gp');

    // Logique pour gérer la soumission du formulaire de paiement
    const handleSubmit = async (event) => {
        event.preventDefault();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: 'price_12345', quantity: 1 }],
            mode: 'payment',
            successUrl: 'https://your-website.com/success',
            cancelUrl: 'https://your-website.com/cancel',
            shippingAddressCollection: {
                allowedCountries: ['FR'],
            },
        });
        if (error) {
            console.error(error);
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
                <Elements stripe={stripePromise}>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }} />
                        <button type="submit" className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                            Valider le paiement
                        </button>
                    </form>
                </Elements>
            </div>
        </div>
    )

}