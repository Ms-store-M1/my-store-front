"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProduct } from "@/services/api/product.api.js";
import BreadCrumb from "@/components/UI/Breadcrumb";
import TitlePage from "@/components/UI/TitlePage";
import ProductFancyBox from "@/components/products/ProductFancyBox";
import Loader from "@/components/UI/Loader";
import Alert from "@/components/UI/Alert";
import { getBase64 } from "../../../lib/base64";
import useAuthStore from "@/stores/authStore";
import Button from "../../../components/UI/Button";
import { addToCart, getCart, updateCartItemQuantity } from "@/services/api/cart.api";
import { ToastContainer } from "react-toastify";
import { showToastMessage } from "@/services/toast";


export default function Page({ onDelete }) {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [placehodlerImage, setPlaceholderImage] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slideIndex, setSlideIndex] = useState(0);
    const [showFancyBox, setShowFancyBox] = useState(false);
    const [error, setError] = useState(null);
    const { isLogged, accountInfo, addToWishlist, checkLogin, isAdmin } = useAuthStore();
    const [wishlisted, setWishlisted] = useState(false);
    const [isOnCart, setIsOnCart] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isActive, setIsActive] = useState(product?.active || false);
    const [editMode, setEditMode] = useState(false);
    const [originalProduct, setOriginalProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [authChecked, setAuthChecked] = useState(false);
    
    useEffect(() => {
        
        fetchLogin();
    }, []);

    const fetchLogin = async () => {
        try {
            await checkLogin();
        } catch (err) {
            console.log(err);
        } finally {
            setAuthChecked(true);
        }
    };

    const fetchCart = async () => {
        try {
            let cart = await getCart(accountInfo.id);
            setCart(cart);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (authChecked) {
            if (isLogged) {
                fetchCart();
            }
        }
    }, [authChecked]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                let product = await getProduct(id);
                if (product) {
                    setProduct(product.data);
                    setIsActive(product.data.active);
                }
            } catch (err) {
                setError(err);
            } finally {
            }
        };
        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const fetchPlaceholderImage = async () => {
            const placeholder = await getBase64(`${product.thumbnail}`);
            setPlaceholderImage(placeholder);
        };
        if (product) {
            setSelectedImage(product.thumbnail);
            fetchPlaceholderImage();
            loading && setLoading(false);
        }
    }, [product]);

    if (loading) return <Loader />;

    const goToNextSlide = () => {
        setSelectedImage(
            slideIndex === 0 ? product.packshot : product.thumbnail
        );
        setSlideIndex(slideIndex === 0 ? 1 : 0);
    };

    const goToPrevSlide = () => {
        setSelectedImage(
            slideIndex === 0 ? product.packshot : product.thumbnail
        );
        setSlideIndex(slideIndex === 0 ? 1 : 0);
    };

    const onWishlist = async (productId) => {
        const req = await addToWishlist(productId);
        setWishlisted(true);
        showToastMessage(true, 'Produit ajouté à la liste de souhait');
    };

    const handleDelete = () => {
        setShowConfirmation(false); // Hide confirmation message
        onDelete(product?.id); // Call onDelete function
    };

    const addToCartHandler = async (product) => {
        if (isLogged) {
            try {
                const existingProduct = cart.find(item => item.productId === product.id);

                if (existingProduct) {
                    const _body = {
                        productId: product.id,
                        quantity: existingProduct.quantity + 1,
                    };
                    const response = await updateCartItemQuantity(
                        accountInfo.id,
                        _body
                    );
                    fetchCart();
                    fetchLogin();
                    setIsOnCart(true);
                    showToastMessage(true, 'Produit ajouté au panier');
                } else {
                    const _body = {
                        productId: product.id,
                        quantity: 1,
                    };
                    const response = await addToCart(accountInfo.id, _body);
                    fetchCart();
                    showToastMessage(true, 'Produit ajouté au panier');
                    setIsOnCart(true);
                }
            } catch (error) {
                console.error("Error adding product to cart:", error);
                showToastMessage(false);
            }
        } else {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingProduct = cart.find(item => item.productId === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ productId: product.id, product, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            console.log("Product added to local cart successfully!");
        }
    };

    const handleCheckboxChange = (i) => {
        setIsActive(!isActive); // Toggle product visibility
        console.log(i);
    };

    const handleEdit = () => {
        if (!editMode) {
            // If entering edit mode, create a copy of the original product
            setOriginalProduct(product);
        }
        setEditMode(!editMode); // Toggle the editMode state
    };

    const handleCancelEdit = () => {
        // Revert changes by restoring the original product
        setProduct(originalProduct);
        setEditMode(false);
    };

    const handleConfirmEdit = () => {
        // Implement logic to save changes made in edit mode

        setEditMode(false);
    };

    const handleimageUpload = (image) => {
        // Implement logic to handle image upload
    };

    return (
        <div className="container mx-auto py-12">
            {error && <Alert message={error.message} type="error" />}
            {(!isAdmin && !isActive) ||
                (!product && (
                    <Alert message="No products found" type="error" />
                ))}
            {showFancyBox && (
                <ProductFancyBox
                    img={selectedImage}
                    prevSlide={() => goToPrevSlide()}
                    nextSlide={() => goToNextSlide()}
                    close={() => {
                        setShowFancyBox(false);
                    }}
                />
            )}
            <BreadCrumb current_page={product?.name} />
            <div className="flex">
                <div className="thumbnail lg:flex-1">
                    <div
                        onClick={() => setShowFancyBox(true)}
                        className="group/show w-4/5 h-[550px] overflow-hidden cursor-pointer"
                    >
                        <Image
                            blurDataURL={placehodlerImage}
                            className="object-cover h-full w-full group-hover/show:scale-105 transition ease-in-out delay-150 z-1"
                            alt={product.name}
                            src={`${selectedImage}`}
                            width={500}
                            height={500}
                        />
                    </div>
                    <div className="carousel flex mt-4 overflow-hidden">
                        <div className="item w-[100px] h-[100px] mr-2">
                            <Image
                                className="cursor-pointer object-cover h-full w-full "
                                alt={product.name}
                                src={`${product.thumbnail}`}
                                width={100}
                                height={100}
                                onMouseOver={() => {
                                    setSelectedImage(product.thumbnail);
                                    setSlideIndex(0);
                                }}
                                onClick={() => {
                                    setSelectedImage(product.thumbnail);
                                    setSlideIndex(0);
                                }}
                            />
                        </div>
                        <div className="item w-[100px] h-[100px]">
                            <Image
                                className="cursor-pointer object-cover h-full w-full"
                                alt={product.name}
                                src={`${product.packshot}`}
                                width={100}
                                height={100}
                                onMouseOver={() => {
                                    setSelectedImage(product.packshot);
                                    setSlideIndex(1);
                                }}
                                onClick={() => {
                                    setSelectedImage(product.packshot);
                                    setSlideIndex(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="content lg:flex-1 p-6">
                    {editMode ? (
                        <textarea
                            value={product.name}
                            onChange={(e) =>
                                setProduct({ ...product, name: e.target.value })
                            }
                            className="w-full h-32 p-2 border rounded-md resize-none"
                        />
                    ) : (
                        <TitlePage title={product.name} />
                    )}

                    {editMode ? (
                        <textarea
                            value={product.price}
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    price: e.target.value,
                                })
                            }
                            className="w-full h-32 p-2 border rounded-md resize-none"
                        />
                    ) : (
                        <p className="mb-3 font-semibold text-lg">
                            {product.price} €
                        </p>
                    )}

                    {editMode ? (
                        <textarea
                            value={product.description}
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    description: e.target.value,
                                })
                            }
                            className="w-full h-32 p-2 border rounded-md resize-none"
                        />
                    ) : (
                        <p className="leading-7">{product.description}</p>
                    )}
                    <Button
                        onClick={() => addToCartHandler(product)}
                        className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 ${} bg-white"
                    >
                        {isOnCart ? "Ajouté au panier" : "Ajouter au panier"}
                    </Button>
                    {isLogged ? <Button
                        onClick={() => onWishlist(product.id)}
                        className="transition ease-in-out delay-150 ml-4 mt-4 inline-flex items-center px-4 py-3 text-sm border border-black-500 font-medium text-center text-black-500 bg-white"
                        disabled={wishlisted}
                    >
                        {wishlisted
                            ? "Ajouté à la liste"
                            : "Ajouter à la liste"}
                    </Button> : ""}
                </div>
                <div>
                    {/* {isAdmin ? (
                            <>
                                <Button
                                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-blue-500 font-medium text-center text-blue-500 bg-white hover:bg-blue-500 hover:text-white"
                                    onClick={handleEdit}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-red-500 font-medium text-center text-red-500 bg-white hover:bg-red-500 hover:text-white"
                                    onClick={() => setShowConfirmation(true)}
                                >
                                    {/* Set showConfirmation to true */}
                                    {/* Supprimer */}
                                {/* </Button> */}
                                {/* <div className="mt-4"> */}
                                    {/* <label className="inline-flex items-center"> */}
                                        {/* <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-gray-600"
                                            checked={isActive}
                                            onChange={(i) =>
                                                handleCheckboxChange(i)
                                            } // Call handleCheckboxChange when the checkbox is changed
                                        /> */}
                                        {/* <span className="ml-2 text-gray-700">
                                            Actif
                                        </span>
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-green-500 font-medium text-center text-green-500 bg-white hover:bg-green-500 hover:text-white"
                                    onClick={handleConfirmEdit}
                                >
                                    Confirm
                                </Button>
                                <Button
                                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-gray-500 font-medium text-center text-gray-500 bg-white hover:bg-gray-500 hover:text-white"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </Button>
                            </>
                        )} */} 
                    {/* Confirmation message */}
                    {showConfirmation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-4 rounded-lg">
                                <p>
                                    Êtes vous sûr de vouloir supprimer cet
                                    article?
                                </p>
                                <div className="flex justify-between mt-4">
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={handleDelete}
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
            <ToastContainer />
        </div>
    );
}
