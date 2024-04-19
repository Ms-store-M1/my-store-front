"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

function Success() {
  const router = useRouter();
  const params = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const session_id = params.session_id;
      console.log('session_id:', session_id);
      if (!session_id) {
        alert("Aucune information de session trouvée.");
        router.navigate('/cart');
        return;
      }

      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/order/confirm?session_id=${session_id}`);
          const data = await response.json();
          if (response.ok) {
            setOrderDetails(data);
          } else {
            throw new Error(data.message || "Erreur lors de la récupération des détails de la commande.");
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de la commande:', error);
          alert(error.message);
          router.navigate('/cart');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [router.isReady, params]);

  // if (loading) {
  //   return <div className="flex justify-center items-center min-h-screen">
  //     <p>Chargement des détails de la commande...</p>
  //   </div>;
  // }

  if (!orderDetails) {
    return <div className="flex justify-center items-center min-h-screen">
      <p>Une erreur est survenue lors de la commande.</p>
    </div>;
  }

  return (
    <div className="min-h-screen w-full px-2 bg-gray-50 flex justify-center items-center">
      <div>
        <h1 className="text-3xl font-bold">Merci pour votre commande !</h1>
        <p>ID de commande : {orderDetails.id}</p>
        <p>Statut du paiement : {orderDetails.payment_status}</p>
        <p>Total payé : {(orderDetails.amount_total / 100).toFixed(2)} €</p>
      </div>
    </div>
  );
}

export default Success;
