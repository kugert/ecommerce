export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Store";
export const APP_DESRIPTION = process.env.NEXT_PUBLIC_APP_NAME || "A modern e-commerce store";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const SIGN_IN_DEFAULT_VALUES = {
    email: "",
    password: "",
}
export const SIGN_UP_DEFAULT_VALUES = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export const shippingAddressDefaultValues = {
    fullName: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
    ? process.env.PAYMENT_METHODS.split(", ")
    : ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const DEFAULT_PRODUCT_VALUES = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
}

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["user", "admin"];

export const FEATURED_PRODUCTS_LIMIT = Number(process.env.FEATURED_PRODUCTS_LIMIT) || 4;

export const REVIEW_FORM_DEFAULT_VALUES = {
  title: "",
  description: "",
  rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev"

export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
export const MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60;
export const MILLISECONDS_IN_A_MINUTE = 1000 * 60;
export const MILLISECONDS_IN_A_SECOND = 1000;
