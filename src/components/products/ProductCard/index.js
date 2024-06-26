"use client";
import React, { Component } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../../UI/Button";
import { deleteProduct, updateProduct } from "@/services/api/product.api";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmation: false,
            isActive: this.props.product.active,
        };
    }

    handleDelete = () => {
        this.setState({ showConfirmation: true });
    };

    handleConfirmDelete = () => {
        this.props.onDelete(this.props.product.id);
        this.setState({ showConfirmation: false });
    };

    handleCancelDelete = () => {
        this.setState({ showConfirmation: false });
    };

    handleCheckboxChange = async (product) => {
        // Update isActive state when the checkbox is toggled
        this.setState((prevState) => ({
            isActive: !prevState.isActive,
        }));
        // if active await updateProduct(product.id, { active: !this.state.isActive});
        await updateProduct(product, { active: !this.state.isActive });
    };

    render() {
        const { product, isAdmin } = this.props;
        const { showConfirmation, isActive } = this.state;

        const isVisible = isAdmin || product.active;

        return (
            isVisible && (
                <div className="group/card max-w-sm bg-white rounded-lg relative">
                    <Link
                        className="group/thumbnail thumbnail"
                        href={`/shop/${product.id}`}
                    >
                        <div className="overflow-hidden w-[300px] h-[300px] relative">
                            <Image
                                className="group-hover/thumbnail:opacity-100 group-hover/thumbnail:scale-105 transition ease-in-out delay-150"
                                alt={product.name}
                                src={`${product.thumbnail}`}
                                fill
                                sizes="100%"
                                style={{ objectFit: "cover" }}
                            />
                            <Image
                                className="opacity-100 group-hover/thumbnail:scale-105 group-hover/thumbnail:opacity-0 transition ease-in-out delay-150"
                                alt={product.name}
                                src={`${product.packshot}`}
                                fill
                                sizes="100%"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </Link>
                    {showConfirmation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-4 rounded-lg">
                                <p>
                                    Êtes-vous sûr de vouloir supprimer cet
                                    article ?
                                </p>
                                <div className="flex justify-between mt-4">
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={this.handleConfirmDelete}
                                    >
                                        Oui
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                        onClick={this.handleCancelDelete}
                                    >
                                        Non
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="py-5">
                        <h2 className="text-md mb-3">{product.name}</h2>
                        <p className="font-semibold font-s">
                            {product.price} €
                        </p>
                        <div className="opacity-0 group-hover/card:opacity-100 transition ease-in-out delay-150">
                            <Link
                                className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-slate-500 font-medium text-center text-slate-500 bg-white hover:bg-slate-500 hover:text-white"
                                href={`/shop/${product.id}?isAdmin=true`}
                            >
                                Voir le produit
                            </Link>
                            {/* {isAdmin && (
                                <Button
                                    className="transition ease-in-out delay-150 mt-4 inline-flex items-center px-4 py-3 text-sm border border-red-500 font-medium text-center text-red-500 bg-white hover:bg-red-500 hover:text-white"
                                    onClick={this.handleDelete}
                                >
                                    Supprimer
                                </Button>
                            )} */}
                        </div>
                    </div>

                    {isAdmin && product.active !== undefined && (
                        <div className="mt-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                    checked={isActive}
                                    onChange={() =>
                                        this.handleCheckboxChange(product.id)
                                    } // Call handleCheckboxChange when the checkbox is changed
                                />
                                <span className="ml-2 text-gray-700">
                                    Actif
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            )
        );
    }
}

export default Index;
