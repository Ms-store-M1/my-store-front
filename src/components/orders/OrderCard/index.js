"use client";
import React, { Component } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../../UI/Button';

class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { order, isAdmin } = this.props;

        const isVisible = isAdmin;

        return (
            isVisible && (
                <div className="group/card max-w-sm bg-white rounded-lg relative">
                    {/* Number of the order */}
                    <h3 className="text-md mb-3">{order.id}</h3>

                    {/* Status of the order */}
                    <h2 className="text-md mb-3">{order.status}</h2>

                    {/* Date of the order */}
                    <h3 className="text-md mb-3">{order.orderDate}</h3>

                    {/* Shipping method */}
                    <h2 className="text-md mb-3">{order.deliveryMode}</h2>

                    {/* Display name of the customer and make it lead to customer's profile if clicked */}
                    <h3 className="text-md mb-3">
                        <Link href={`../account/${order.userId}`}>
                            <a>{`${order.user.firstName} ${order.user.lastName}`}</a>
                        </Link>
                    </h3>
                    
                    {/* Number of products within the order */}
                    <h3 className="text-md mb-3">{order.totalItems}</h3>

                    {/* Total price of the order */}
                    <h2 className="text-md mb-3">{order.totalAmount}€</h2>

                    {/* Button that leads to the details of the order */}
                    <Link href={`/orders/${order.id}`}>
                        <a>
                            <Button>Plus de détails</Button>
                        </a>
                    </Link>

                </div>
            )
        );
    }
}