"use server";

import {z} from "zod";
import {insertReviewSchema} from "@/lib/validators";
import {formatError} from "@/lib/utils";
import {auth} from "@/auth-server";
import {getProductById} from "@/lib/actions/product.actions";
import {prisma} from "@/db/prisma";
import {revalidatePath} from "next/cache";

// Create and update review actions
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
  try {
    const session = await auth();
    if (!session) throw new Error("User not logged in");

    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    const product = await getProductById(review.productId);
    if (!product) throw new Error("Product not found");

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

      const averageRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId: review.productId,
        },
      });
      const numReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });

    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: "Review submitted successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all reviews for a product
export async function getAllReviewsForProduct(productId: string) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

// Get a review written by a current user
export async function getMyReview(productId: string) {
  const session = await auth();
  if (!session) throw new Error("User not logged in");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  })
}
