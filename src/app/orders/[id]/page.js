"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getOrder, removeOrder } from "@/services/api/order.api.js";
import BreadCrumb from "@/components/UI/Breadcrumb";
import TitlePage from "@/components/UI/TitlePage";
import OrderFancyBox from "@/components/orders/OrderFancyBox";
import Loader from "@/components/UI/Loader";
import Alert from "@/components/UI/Alert";
import { getBase64 } from "../../../lib/base64";
import useAuthStore from "@/stores/authStore";
import Button from "../../../components/UI/Button";
import { getProductsFromOrder, removeProductFromOrder, updateProductQuantityInOrder, clearProductsFromOrder } from "@/services/api/productOrder.api.js";

export default function Page({ isAdmin = true }) {
    
    return (
        <div className="container mx-auto py-12">
            <h1>Work in progress</h1>
        </div>
    );
}