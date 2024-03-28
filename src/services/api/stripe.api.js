export async function handlePayment() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const session = await response.json();
        window.location.href = session.url;
      } else {
        console.error('Réponse du serveur non OK', response);
      }
    } catch (error) {
      console.error('Échec de la création de la session de paiement', error);
    }
  }
  