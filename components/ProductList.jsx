const ProductList = ({ category }) => {
  const { products, loading, error, hasMore, loadMoreRef } = useProducts(category);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
      
      {loading && <div>Loading...</div>}
      
      {/* Intersection Observer target */}
      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  );
};

export default ProductList;
