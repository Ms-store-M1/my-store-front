"use client";
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getOrder, removeOrder } from "@/services/api/order.api.js";
import { getUser } from "@/services/api/user.api.js";
import { getProductsFromOrder, removeProductFromOrder, updateProductQuantityInOrder, clearProductsFromOrder } from "@/services/api/productOrder.api.js";
import TitlePage from "@/components/UI/TitlePage";
import OrderFancyBox from "@/components/orders/OrderFancyBox";
import Loader from "@/components/UI/Loader";
import Alert from "@/components/UI/Alert";
import ProductsGrid from "@/components/products/ProductsGrid";
import { getBase64 } from "../../../lib/base64";
import useAuthStore from "@/stores/authStore";
import Button from "../../../components/UI/Button";

// To do : fetch products

export default function Page({ isAdmin = true }) {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLogged, accountInfo, checkLogin, isBuyer } = useAuthStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [originalOrder, setOriginalOrder] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);

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
        const fetchOrderAndUser = async () => {
            setLoading(true);
            try {
                let order = await getOrder(id);
                if (order) {
                    setOrder(order);

                    // Fetch user data associated with the order
                    let user = await getUser(order.userId);
                    if (user) {
                        setUser(user.data);
                    }
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchOrderAndUser();
        }
    }, [id]);

    if (loading) return <Loader />;

    const handleAskForRefund = () => {
        setShowConfirmation(false); // Hide confirmation message
        onAskForRefund(order?.id);
    };

    const handleEdit = () => {
        if (!editMode) {
            // If entering edit mode, create a copy of the original order
            setOriginalOrder(order);
        }
        setEditMode(!editMode); // Toggle the editMode state
    };

    const handleCancelEdit = () => {
        // Revert changes by restoring the original order
        setOrder(originalOrder);
        setEditMode(false);
    };

    const handleConfirmEdit = () => {
        // Implement logic to save changes made in edit mode

        setEditMode(false);
    };

    const formatOrderDate = (orderDate) => {
        const date = new Date(orderDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        const year = date.getFullYear();

        setFormattedDate(`${day}/${month}/${year}`);
    }
    
    return (
        <div className="container mx-auto py-12">
            {error && <Alert message={error.message} type="error" />}
            {(!isAdmin || !isBuyer) ||
                (!order && (
                    <Alert message="No order found" type="error" />
                ))
            }
            <div className="flex">
                <div className="content lg:flex-1 p-6">
                    <TitlePage title={order.id} />

                    <p className="text-md mb-3">
                        <Link href={`../account/${order.userId}`}>
                            {`${user.data.firstname} ${user.data.lastname}`}
                        </Link>
                    </p>

                    <p className="text-md mb-3">{order.status}</p>

                    <p className="text-md mb-3">{formattedDate}</p>

                    <p className="text-md mb-3">Livraison : {order.deliveryMode}</p>

                    <p className="text-md mb-3">{order.totalItems} articles</p>

                    <p className="mb-3 font-semibold text-lg">{order.totalAmount}€ en tout</p>

                </div>
                <div>
                    {isAdmin && (
                        <>
                            {editMode ? (
                                <>
                                    <Button
                                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-green-500 font-medium text-center text-green-500 bg-white hover:bg-green-500 hover:text-white"
                                        onClick={handleConfirmEdit}
                                    >
                                        Confirmer
                                    </Button>
                                    <Button
                                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-gray-500 font-medium text-center text-gray-500 bg-white hover:bg-gray-500 hover:text-white"
                                        onClick={handleCancelEdit}
                                    >
                                        Annuler
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-blue-500 font-medium text-center text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
                                        onClick={handleEdit}>
                                        Modifier
                                    </Button>
                                    <Button
                                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-red-500 font-medium text-center text-red-500 bg-white hover:bg-red-500 hover:text-white"
                                        onClick={() => setShowConfirmation(true)}> {/* Set showConfirmation to true */}
                                        Supprimer
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                    <div className="mt-4">
                        {isAdmin && (
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                    checked={isActive}
                                    onChange={handleCheckboxChange} // Call handleCheckboxChange when the checkbox is changed
                                />
                                <span className="ml-2 text-gray-700">Actif</span>
                            </label>
                        )}
                    </div>
                    {showConfirmation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-4 rounded-lg">
                                <p>
                                    Êtes vous sûr de vouloir demander un remboursement?
                                </p>
                                <div className="flex justify-between mt-4">
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={handleAskForRefund}
                                    >
                                        Oui
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                        onClick={() =>
                                            setShowConfirmation(false)
                                        }
                                    >
                                        Non
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <h1>Work in progress</h1>
        </div>
    );
}