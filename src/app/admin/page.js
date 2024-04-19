"use client";
import React, { useEffect, useState } from "react";
import { updateUser } from "@/services/api/user.api";
import { fetchUsers } from "@/services/api/user.api";
import { deleteUser } from "@/services/api/user.api";
import { deleteProduct } from "@/services/api/product.api";
import { updateProduct } from "@/services/api/product.api";
import { getAllProducts } from "@/services/api/product.api";
import useAuthStore from "@/stores/authStore";
import "./page.css";

const Page = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editedUserData, setEditedUserData] = useState({});
    const { isAdmin, checkLogin } = useAuthStore();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedProductData, setEditedProductData] = useState({});

    useEffect(() => {
        setLoading(true);
        const checkLoginStatus = async () => {
            try {
                await checkLogin();
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification du login :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
        if (!isAdmin) {
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
            getAllProducts()
                .then((response) => {
                    console.log("Response from getProducts :", response);
                    setProducts(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
            fetchUsers()
                .then((response) => {
                    console.log("Response from fetchUsers :", response);
                    setUsers(response);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }, [isAdmin]);

    useEffect(() => {
        console.log('etingProductData', editedProductData);
    }, [editedProductData]);

    if (!isAuthorized) {
        return (
            <div>401 Unauthorized - You do not have access to this page.</div>
        );
    }

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditedUserData({ ...user });
    };

    const handleSaveUser = async () => {
        try {
            setLoading(true);
            await updateUser(editedUserData);
            const updatedUsers = users.map((u) =>
                u.id === editedUserData.id ? editedUserData : u
            );
            setUsers(updatedUsers);
            setEditingUser(null);
            setEditedUserData({});
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setEditedProductData({ ...product });
    };

    const handleSaveProduct = async () => {
        try {
            setLoading(true);
            // Comparer deux objets et ressortir les différences
            const editedProductDataChanges = Object.keys(editingProduct).reduce((acc, key) => {
                // Convertir les valeurs de chaîne potentielles en types de données appropriés
                const originalValue = editingProduct[key];
                let newValue = editedProductData[key];
            
                // Tentative de conversion pour les booléens et les nombres si les types ne correspondent pas
                if (typeof originalValue === 'boolean' && typeof newValue === 'string') {
                    newValue = newValue === 'true';  // Convertit "true" en true et "false" en false
                } 
                // Utilisation de JSON.stringify pour comparer efficacement les valeurs complexes
                if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
                    acc[key] = newValue;
                }
            
                console.log(acc);
                return acc;
            }, {});

            console.log(
                "Edited Product Data Changes:",
                JSON.stringify(editedProductDataChanges, null, 2)
            );

            // Mise à jour du produit avec les changements détectés
            await updateProduct(editedProductData.id, editedProductDataChanges);

            // Mise à jour de la liste des produits
            const updatedProducts = products.map((p) =>
                p.id === editedProductData.id
                    ? { ...p, ...editedProductDataChanges }
                    : p
            );

            setProducts(updatedProducts);
            setEditingProduct(null);
            setEditedProductData({});
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(
            `Voulez-vous vraiment supprimer l'utilisateur ${user.lastname} ${user.firstname} ?`
        );

        if (confirmDelete) {
            try {
                setLoading(true);
                console.log("User ID to delete:", user.id);
                await deleteUser(user.id);
                const updatedUsers = users.filter((u) => u.id !== user.id);
                setUsers(updatedUsers);
            } catch (error) {
                console.error("Error deleting user:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteProduct = async (product) => {
        const confirmDelete = window.confirm(
            `Voulez-vous vraiment supprimer le Produit ${product.name} ?`
        );

        if (confirmDelete) {
            try {
                setLoading(true);
                console.log("Product ID to delete:", product.id);
                await deleteProduct(product.id);
                const updatedProducts = products.filter(
                    (p) => p.id !== product.id
                );
                setProducts(updatedProducts);
            } catch (error) {
                console.error("Error deleting product:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderField = (fieldName, placeholder) =>
        editingUser === user ? (
            <input
                type="text"
                value={editedUserData[fieldName]}
                onChange={(e) =>
                    setEditedUserData({
                        ...editedUserData,
                        [fieldName]: e.target.value,
                    })
                }
            />
        ) : (
            <>{user[fieldName] || placeholder}</>
        );

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div>
                <h1>Voici la liste de vos utilisateurs</h1>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Adresse</th>
                            <th>Code Postal</th>
                            <th>Ville</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.mail}>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.lastname}
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    lastname: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.lastname}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.firstname}
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    firstname: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.firstname}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.address}
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    address: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.address}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.zipcode}
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    zipcode: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.zipcode}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.city}
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    city: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.city}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            value={editedUserData.phone}
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.phone}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={editedUserData.mail}
                                            onChange={(e) =>
                                                setEditedUserData({
                                                    ...editedUserData,
                                                    mail: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{user.mail}</>
                                    )}
                                </td>
                                <td>
                                    {editingUser === user ? (
                                        <button
                                            className="user-actions-button save"
                                            onClick={handleSaveUser}
                                        >
                                            Sauvegarder
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="user-actions-button"
                                                onClick={() =>
                                                    handleEditUser(user)
                                                }
                                            >
                                                Editer
                                            </button>
                                            <button
                                                className="user-actions-button delete"
                                                onClick={() =>
                                                    handleDeleteUser(user)
                                                }
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h1>Voici la liste des produits</h1>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Descritpion</th>
                            <th>active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {editingProduct === product ? (
                                        <input
                                            type="text"
                                            value={editedProductData.name}
                                            onChange={(e) =>
                                                setEditedProductData({
                                                    ...editedProductData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{product.name}</>
                                    )}
                                </td>
                                <td>
                                    {editingProduct === product ? (
                                        <input
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            type="text"
                                            value={editedProductData.price}
                                            onChange={(e) =>
                                                setEditedProductData({
                                                    ...editedProductData,
                                                    price: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{product.price}</>
                                    )}
                                </td>
                                <td>
                                    {editingProduct === product ? (
                                        <input
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            type="text"
                                            value={
                                                editedProductData.description
                                            }
                                            onChange={(e) =>
                                                setEditedProductData({
                                                    ...editedProductData,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <>{product.description}</>
                                    )}
                                </td>

                                <td>
                                    {editingProduct === product ? (
                                        <select
                                            value={
                                                editedProductData.active
                                            }
                                            onChange={(e) =>
                                                setEditedProductData({
                                                    ...editedProductData,
                                                    active:
                                                        e.target.value,
                                                })
                                            }
                                        >                                            
                                            <option value={true}>OUI</option>
                                            <option value={false}>NON</option>
                                        </select>
                                    ) : (
                                        <>{product.active ? "OUI" : "NON"}</>
                                    )}
                                </td>
                                <td>
                                    {editingProduct === product ? (
                                        <button
                                            className="user-actions-button save"
                                            onClick={handleSaveProduct}
                                        >
                                            Sauvegarder
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="user-actions-button"
                                                onClick={() =>
                                                    handleEditProduct(product)
                                                }
                                            >
                                                Editer
                                            </button>
                                            <button
                                                className="user-actions-button delete"
                                                onClick={() =>
                                                    handleDeleteProduct(product)
                                                }
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
