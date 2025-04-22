# E-Commerce Next.js App

This is a simple e-commerce application built with Next.js, TypeScript, and Tailwind CSS. It features a product listing page, a shopping cart, and a checkout process.

## Getting Started
>`npm i` - Install all dependencies
>
>`npm run dev` - Start the development server
>
>`npm run build` - Build the application for production

### Prisma DB:
>After making changes to the Prisma schema, run the following commands:
>
>`npx prisma generate` - Generate Prisma client
>
> `npx prisma migrate dev --name <migration_name>` - Run migrations

## Features
- Product listing with images, titles, and prices
- Shopping cart functionality
- Checkout process with form validation
- Responsive design using Tailwind CSS
- TypeScript for type safety
- State management using React Context API
- Custom hooks for managing cart state
- API integration for fetching products
- Error handling and loading states

## Services used
- [Vercel](https://vercel.com/) for deployment
- [Neon](https://neon.tech/) for database
- [Uploadthing](https://uploadthing.com/) for file uploads
- [Resend](https://resend.com/) for email sending
- [Stripe](https://stripe.com/) for payment processing
- [PayPal](https://www.paypal.com/) for payment processing

## Environment Variables Description
```
NEXT_PUBLIC_APP_NAME="Prostore"
NEXT_PUBLIC_APP_DESCRIPTION="A modern e-commerce store built with Next.js"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"

PAYMENT_METHODS="PayPal, Stripe, CashOnDelivery"
DEFAULT_PAYMENT_METHOD="PayPal"

PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
PAYPAL_APP_CLIENT_ID=
PAYPAL_APP_SECRET=

PAYPAL_USER_EMAIL=
PAYPAL_USER_PASSWORD=

UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
SENDER_EMAIL="onboarding@resend.dev"
```

## Environment Variables Description
- NEXT_PUBLIC_APP_NAME: The name of the application
- NEXT_PUBLIC_APP_DESCRIPTION: The description of the application
- NEXT_PUBLIC_SERVER_URL: The server URL for the application

- DATABASE_URL: The connection string for the (Neon) database

- NEXTAUTH_SECRET: The secret used for NextAuth.js (run `openssl rand -base64 32` to generate a random secret)
- NEXTAUTH_URL: The URL of the application (e.g., `https://your-app.vercel.app`)
- NEXTAUTH_URL_INTERNAL: The internal URL of the application (e.g., `http://localhost:3000`)

- PAYMENT_METHODS: A comma-separated list of payment methods supported by the application (e.g., `Stripe, PayPal, Cash on Delivery`)
- DEFAULT_PAYMENT_METHOD: The default payment method to be used (e.g., `PayPal`)

- PAYPAL_API_URL: The base URL for the PayPal API (e.g., `https://api-m.sandbox.paypal.com`)
- PAYPAL_APP_CLIENT_ID: The client ID for the PayPal app
- PAYPAL_APP_SECRET: The client secret for the PayPal app

- PAYPAL_USER_EMAIL: The email address of the PayPal user
- PAYPAL_USER_PASSWORD: The password of the PayPal user

- UPLOADTHING_TOKEN: The token used for Uploadthing
- UPLOADTHING_SECRET: The secret used for Uploadthing
- UPLOADTHING_APP_ID: The app ID for Uploadthing (can get it from the Uploadthing url)

- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: The publishable key for Stripe
- STRIPE_SECRET_KEY: The secret key for Stripe
- STRIPE_WEBHOOK_SECRET: The webhook secret for Stripe

- RESEND_API_KEY: The API key for Resend
- SENDER_EMAIL: The email address used to send emails (e.g., `onboarding@resend.dev`)
