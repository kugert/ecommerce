import { z } from 'zod';
import { formatNumberWithDecimalPlaces } from "@/lib/utils";
import {PAYMENT_METHODS} from "@/lib/constants";

const currency = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimalPlaces(Number(value))),
        "Price must be a valid number with two decimal places"
    );

// Schema for products insertion
export const insertProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    slug: z.string().min(3, "Slug must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    brand: z.string().min(3, "Brand must be at least 3 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});

// Schema for signing users in
export const signInFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for signing users up
export const signUpFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: "Passwords don't match", path: ["confirmPassword"] }
);

// Cart item schema
export const cartItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive integer"),
    image: z.string().min(1, "Product image is required"),
    price: currency,
});

// Cart schema
export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session Cart ID is required"),
    userId: z.string().optional().nullable(),
});

// Shipping address schema
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters long"),
    streetAddress: z.string().min(3, "Address must be at least 3 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters long"),
    country: z.string().min(3, "Country must be at least 3 characters long"),
    lat: z.number().optional(),
    lng: z.number().optional(),
});

// Payment method schema
export const paymentMethodSchema = z.object({
    type: z.string().min(1, "Payment method type is required"),
}).refine(
    (data) => PAYMENT_METHODS.includes(data.type),
    {
        path: ["type"],
        message: "Invalid payment method type",
    }
);

// Order schema
export const insertOrderSchema = z.object({
    userId: z.string().min(1, "User id is required"),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine(
        (data) => PAYMENT_METHODS.includes(data),
        {message: "Invalid payment method"},
    ),
    shippingAddress: shippingAddressSchema,
});

// Order item schema
export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
});

export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
});

// Schema for updating user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters long"),
  email: z.string().min(3, "Email is required"),
});
