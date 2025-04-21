"use server";
import { prisma } from "@/db/prisma";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {FEATURED_PRODUCTS_LIMIT, LATEST_PRODUCTS_LIMIT, PAGE_SIZE} from "@/lib/constants";
import {revalidatePath} from "next/cache";
import {insertProductSchema, updateProductSchema} from "@/lib/validators";
import {z} from "zod";
import {Prisma} from "@prisma/client";

// Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: "desc" },
    });

    return convertToPlainObject(data);
}

// Get a single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {slug: slug},
  })
}

// Get a single product by id
export async function getProductById(productId: string) {
  const data =  await prisma.product.findFirst({
    where: { id: productId },
  })
  if (!data) throw new Error("Product not found");

  return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter: Prisma.ProductWhereInput = query && query !== "all" ? {
    name: {
      contains: query,
      mode: 'insensitive',
    } as Prisma.StringFilter,
  } : {};

  const categoryFilter: Prisma.ProductWhereInput = category && category !== "all" ? { category } : {};

  const priceFilter: Prisma.ProductWhereInput = price && price !== "all" ? {
    price: {
      gte: Number(price.split("-")[0]),
      lte: Number(price.split("-")[1]),
    } as Prisma.IntFilter,
  } : {};

  const ratingFilter: Prisma.ProductWhereInput = rating && rating !== "all" ? {
    rating: {
      gte: Number(rating),
    } as Prisma.IntFilter,
  } : {};

  let sortBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "lowest":
      sortBy = { price: "asc" };
      break;
    case "highest":
      sortBy = { price: "desc" };
      break;
    case "top-rated":
      sortBy = { rating: "desc" };
      break;
    case "lowest-rated":
      sortBy = { rating: "asc" };
      break;
    default:
      sortBy = { createdAt: "desc" };
  }

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy: sortBy,
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
    });
    if (!product) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({data: product});

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const newProductData = updateProductSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: newProductData.id },
    });
    if (!product) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: newProductData.id },
      data: newProductData,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all categories
export async function getAllCategories() {
  return await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: FEATURED_PRODUCTS_LIMIT,
  });

  return convertToPlainObject(data);
}
