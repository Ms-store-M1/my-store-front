import OrderCard from "@/components/orders/OrderCard";

const Index = ({orders, users, isAdmin}) => {
    return (
        <div className="grid grid-cols-4 gap-8 my-12">
            {
                orders.map(order => (
                    <OrderCard key={order.id} order={order} user={users[order.userId]} isAdmin={isAdmin} />
                ))
            }
        </div>
    );
}

export default Index;