"use client";
import Link from "next/link";
import { getProducts } from "@/services/api/product.api.js";
import { useEffect, useState } from "react";
import Alert from "@/components/UI/Alert";
import ProductsGrid from "@/components/products/ProductsGrid";
import TitlePage from "@/components/UI/TitlePage";
import ProductsCounter from "@/components/products/ProductsCounter";
import useAuthStore from "@/stores/authStore";

export default function Page({ searchParams }) {
    const { isAdmin, checkLogin } = useAuthStore();
    const { take = 8 } = searchParams || {};
    const [products, setProducts] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await checkLogin();
                const productsData = await getProducts(take);
                setProducts(productsData);
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification du login :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, checkLogin, take]);

    if (!products || products.success === false) {
        return <Alert message={products?.message} type="error" />;
    }

    return (
        <div className="container mx-auto">
            <TitlePage title="Shop" />
            <ProductsCounter productsLength={products.data.length} />
            <ProductsGrid products={products.data} isAdmin={isAdmin} />
            <div className="flex justify-center mb-24">
                {Number(take) <= products.data.length && (
                    <Link
                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                        href={`/shop?take=${Number(take) + 8}`}
                    >
                        See more
                    </Link>
                )}
            </div>
        </div>
    );
}
