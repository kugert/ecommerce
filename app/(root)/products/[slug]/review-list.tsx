"use client";

import { useState, useEffect } from "react";
import {Review} from "@/types";
import Link from "next/link";
import ReviewForm from "./review-form";
import { getAllReviewsForProduct } from "@/lib/actions/review.actions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar, User} from "lucide-react";
import {formatDateTime} from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

interface ReviewListProps {
  userId: string;
  productId: string;
  productSlug: string;
}

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const resp = await getAllReviewsForProduct(productId);
      setReviews(resp.data || []);
    };

    loadReviews();
  }, [productId]);

  const reload = async () => {
    const resp = await getAllReviewsForProduct(productId);
    setReviews([...resp.data]);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <div>No review yet.</div>
      )}
      {userId ? (
        <ReviewForm userId={userId} productId={productId} onReviewSubmit={reload} />
      ) : (
        <div>
          Please
          <Link
            href={`/sign-in?callbackUrl=/products/${productSlug}`}
            className="text-blue-700 px-2"
          >sign in</Link>
          to write a review.
        </div>
      )}
      <div className="flex flex-col gap-3">
        { reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{ review.title }</CardTitle>
              </div>
              <CardDescription>
                { review.description }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-1 w-3 h-3" />
                  {review.user ? review.user.name : "Deleted User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 w-3 h-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReviewList;
