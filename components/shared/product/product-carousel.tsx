"use client";

import {Product} from "@/types";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

interface ProductCarouselProps {
  data: Product[];
}

const ProductCarousel = ({ data }: ProductCarouselProps) => {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnMouseEnter: true,
          stopOnInteraction: true,
        })
      ]}
    >
     <CarouselContent>
       {data.map((product: Product) => (
         <CarouselItem key={product.id}>
           <Link href={`/products/${product.slug}`}>
             <div className="relative mx-auto">
               <Image
                 src={product.banner!}
                 alt={product.name}
                 height={0}
                 width={0}
                 sizes="100vw"
                 className="w-full h-auto"
               />
               <div className="absolute inset-0 flex items-end justify-center">
                 <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                    {product.name}
                 </h2>
               </div>
             </div>
           </Link>
         </CarouselItem>
       ))}
     </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ProductCarousel;
