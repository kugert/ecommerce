import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import {getMyCart} from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth-server";
import Rating from "@/components/shared/product/rating";

const ProductDetailPage = async (props: {
    params: Promise<{ slug: string }>;
}) => {
    const session = await auth();
    const userId = session?.user?.id;

    const { slug } = await props.params;

    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const cart = await getMyCart();

    return (
        <>
            <section>
                <div className="grid grid-cols-1 md:grid-cols-5">
                    {/* Images Column */}
                    <div className="col-span-2">
                        {/* Images Component */}
                        <ProductImages images={product.images} />
                    </div>
                    {/* Details Column */}
                    <div className="col-span-2 p-5">
                        <div className="flex flex-col gap-6">
                            <p>
                                { product.brand } { product.category }
                            </p>
                            <h1 className="h3-bold">{ product.name }</h1>
                            <Rating value={Number(product.rating)} />
                            <p>{product.numReviews} review{product.numReviews === 1 ? "" : "s"}</p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <ProductPrice
                                    value={String(product.price)}
                                    className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                                />
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="font-semibold">Description</p>
                            <p>{ product.description }</p>
                        </div>
                    </div>
                    {/* Actions Column */}
                    <div>
                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-2 flex justify-between">
                                    <div>Price</div>
                                    <div>
                                        <ProductPrice value={String(product.price)} />
                                    </div>
                                </div>
                                <div className="mb-2 flex justify-between">
                                    <div>Status</div>
                                    {product.stock > 0 ? (
                                        <Badge variant="outline">
                                            In Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            Out Of Stock
                                        </Badge>
                                    )}
                                </div>
                                {product.stock > 0 && (
                                    <div className="flex-center">
                                        <AddToCart
                                            item={{
                                                productId: product.id,
                                                name: product.name,
                                                slug: product.slug,
                                                price: product.price,
                                                qty: 1,
                                                image: product.images[0],
                                            }}
                                            cart={cart}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="mt-10">
              <h2 className="h2-bold">Customer Reviews</h2>
              <ReviewList userId={userId || ""} productId={product.id} productSlug={product.slug} />
            </section>
        </>
    );
};

export default ProductDetailPage;
