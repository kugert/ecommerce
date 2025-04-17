"use server";
import { prisma } from "@/db/prisma";
import {convertToPlainObject, formatError} from "@/lib/utils";
import {LATEST_PRODUCTS_LIMIT, PAGE_SIZE} from "@/lib/constants";
import {revalidatePath} from "next/cache";
import {insertProductSchema, updateProductSchema} from "@/lib/validators";
import {z} from "zod";

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
  // query,
  limit = PAGE_SIZE,
  page,
  // category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
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
