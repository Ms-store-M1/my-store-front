import OrderCard from "@/components/orders/OrderCard";

const Index = ({order, isAdmin}) => {
    return (
        <div className="grid grid-cols-4 gap-8 my-12">
            {
                order.map(order => (
                    <OrderCard key={order.id} order={order} isAdmin={isAdmin} />
                ))
            }
        </div>
    );
}

export default Index;