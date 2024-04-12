import { useEffect, useState } from "react";

const Wishlist = ({ wishlist }) => {

    return (
        <div className="p-4">
            {
                wishlist.length > 0 ? (
                    <div>
                        {
                            wishlist.map((item) => {
                                return (
                                    <div key={item.id} className="flex items-center justify-between p-2 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <img src={item.thumbnail} alt={item.name} className="w-20 h-20 object-cover" />
                                            <div className="ml-2">
                                                <h2 className="text-lg font-semibold">{item.name}</h2>
                                                <p className="text-sm text-gray-500">{item.price} €</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p>Votre liste de souhait est vide.</p>
                    </div>
                )
            }
        </div>
    )
}

export default Wishlist;