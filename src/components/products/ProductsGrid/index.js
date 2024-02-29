import ProductCard from "@/components/products/ProductCard";

const Index = ({products, isAdmin}) => {
  return (
    <div className="grid grid-cols-4 gap-8 my-12">
      {
        products.map(product => (
          <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
        ))
      }
    </div>
  );
}

export default Index;
