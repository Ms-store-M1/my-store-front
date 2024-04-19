"use client";
import React, { Component } from 'react';
import Link from 'next/link';
import Button from '../../UI/Button';

class Index extends Component {
    formatOrderDate(orderDate) {
        const date = new Date(orderDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    render() {
        const { order, user, isAdmin } = this.props;
        const formattedDate = this.formatOrderDate(order.orderDate);
        const isVisible = isAdmin;

            return (
                isVisible && (
                    <div className="group/card max-w-sm bg-white rounded-lg relative">
                        {/* Number of the order */}
                        <h3 className="text-md mb-3">Numéro {order.id}</h3>

                        {/* Display name of the customer and make it lead to customer's profile if clicked */}
                        <h3 className="text-md mb-3">
                            <Link href={`../account/${order.userId}`}>
                                {`${user.data.firstname} ${user.data.lastname}`}
                            </Link>
                        </h3>

                        {/* Status of the order */}
                        <h2 className="text-md mb-3">{order.status}</h2>

                        {/* Date of the order */}
                        <h3 className="text-md mb-3">{formattedDate}</h3>

                        {/* Shipping method */}
                        <h2 className="text-md mb-3">Livraison : {order.deliveryMode}</h2>
                    
                        {/* Number of products within the order */}
                        <h3 className="text-md mb-3">{order.totalItems} articles</h3>

                        {/* Total price of the order */}
                        <h2 className="text-md mb-3">{order.totalAmount}€ en tout</h2>

                        {/* Button that leads to the details of the order */}
                        <Link href={`/orders/${order.id}`}>
                            <Button>Plus de détails</Button>
                        </Link>

                    </div>
                )
            );
    }
}

export default Index;