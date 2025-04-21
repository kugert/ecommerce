import Link from "next/link";
import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import { Product } from "@/types";
import Rating from "@/components/shared/product/rating";

interface ProductListProps {
    product: Product;
}

const ProductCard = ({
    product,
 }: ProductListProps) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items-center">
                <Link href={`/products/${product.slug}`}>
                    <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true} />
                </Link>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/products/${product.slug}`}>
                    <h2 className="text-sm font-medium">{product.name}</h2>
                </Link>
                <div className="flex-between gap-4">
                    <Rating value={Number(product.rating)} />
                    { product.stock > 0 ? (
                        <ProductPrice value={product.price} className="font-bold" />
                    ) : (
                        <p className="text-destructive">Out of stock</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default ProductCard;
