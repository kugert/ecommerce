import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Home = async () => {
  const latestProducts = await getLatestProducts();
  return (
      <ProductList data={latestProducts.map((values) => (
          {
            ...values,
            price: values.price.toString(),
            rating: values.rating.toString(),
          }
      ))} title="Newest Arrivals" limit={4} />
  );
}

export default Home;