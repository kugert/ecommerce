import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import VewAllProductsButton from "@/components/vew-all-products-button";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const Home = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      { featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts.map((values) => (
          {
            ...values,
            price: values.price.toString(),
            rating: values.rating.toString(),
          }
      ))} title="Newest Arrivals" limit={4} />
      <VewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
}

export default Home;
