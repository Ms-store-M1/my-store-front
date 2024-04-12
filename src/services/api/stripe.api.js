export async function handlePayment(cart) {
  try {
    // Ici, `cart` est un tableau d'objets représentant les articles dans le panier
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }), // Envoi du panier au backend pour traitement
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const session = await response.json();
    return { url: session.url }; // Supposition que le backend renvoie l'URL de la session
  } catch (error) {
    return { error };
  }
}
