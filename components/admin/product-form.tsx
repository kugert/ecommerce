"use client";

import { Product } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {ControllerRenderProps, SubmitHandler, useForm} from "react-hook-form";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PRODUCT_VALUES } from "@/lib/constants";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import slugify from "slugify";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {capitalize} from "@/lib/utils";
import {createProduct, updateProduct} from "@/lib/actions/product.actions";
import {UploadButton} from "@/lib/uploadthing";
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";

interface ProductFormProps {
  type: "create" | "update";
  productId?: string;
  product?: Product;
}

const ProductForm = ({
  type,
  product,
  productId,
}: ProductFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(type === "update" ? updateProductSchema: insertProductSchema),
    defaultValues: product && type === "update" ? product : DEFAULT_PRODUCT_VALUES,
  });

  const onSubmitHandle: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    let res;
    if (type === "create") {
      res = await createProduct(values);
    } else {
      if (!productId) {
        router.push("/admin/products");
        return;
      }
      res = await updateProduct({ ...values, id: productId });
    }

    if (!res.success) {
      toast.error(res.message, {
        style: {
          backgroundColor: "red",
          color: "white"
        }
      })
    } else {
      toast.success(res.message);
      router.push("/admin/products");
    }

  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmitHandle)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "name"> }) => (
              <FormItem className="w-full mb-11">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "slug"> }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(
                            form.getValues("name"),
                            { lower: true },
                          ),
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "category"> }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "brand"> }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "price"> }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "stock"> }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image) => (
                        <Image
                          key={image}
                          src={image}
                          alt="Product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(error.message, {
                              style: {
                                backgroundColor: "red",
                                color: "white"
                              }
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex space-x-2 items-center">
                    <FormControl>
                      <Checkbox checked={ field.value } onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="">Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              { isFeatured && banner && (
                <Image
                  src={banner}
                  alt="Banner image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(error.message, {
                      style: {
                        backgroundColor: "red",
                        color: "white"
                      }
                    })
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, "description"> }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            { form.formState.isSubmitting ? "Submitting..." : `${capitalize(type)} Product` }
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;
