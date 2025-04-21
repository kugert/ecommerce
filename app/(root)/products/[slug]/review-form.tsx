"use client";

import {useState} from "react";
import {toast} from "sonner";
import {SubmitHandler, useForm} from "react-hook-form";
import {insertReviewSchema} from "@/lib/validators";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {REVIEW_FORM_DEFAULT_VALUES} from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {StarIcon} from "lucide-react";
import { createUpdateReview, getMyReview } from "@/lib/actions/review.actions";

interface ReviewFormProps {
  userId: string;
  productId: string;
  onReviewSubmit: () => void;
}

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmit,
}: ReviewFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: REVIEW_FORM_DEFAULT_VALUES,
  });

  const handleOpenForm = async () => {
    form.setValue("userId", userId);
    form.setValue("productId", productId);

    const review = await getMyReview(productId);
    if (review) {
      form.setValue("title", review.title);
      form.setValue("description", review.description);
      form.setValue("rating", review.rating);
    }

    setOpen(true);
  }

  const submitReviewForm: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values,
    ) => {
    const resp = await createUpdateReview({
      ...values,
      productId,
    });
    if (!resp.success) {
      toast.error(resp.message, {
        style: {
          backgroundColor: "red",
          color: "white"
        }
      });
      return;
    }
    setOpen(false);
    onReviewSubmit();

    toast.success(resp.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">Write a Review</Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(submitReviewForm)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts about this product.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem
                            value={(index + 1).toString()}
                            key={index}
                          >
                            {index+1} <StarIcon className="w-4 h-4" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewForm;
