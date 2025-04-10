"use server";

import {shippingAddressSchema, signInFormSchema, signUpFormSchema} from "@/lib/validators";
import {auth, signIn, signOut} from "@/auth-server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import {ShippingAddress} from "@/types";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        await signIn("credentials", user);

        return {
            success: true,
            message: "Signed in successfully",
        };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            success: false,
            message: "Invalid credentials",
        };
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up the user
export async function signUpUser(
    prevState: unknown,
    formData: FormData
) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });

        const plainPassword = user.password;
        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });
        await signIn("credentials", {
            email: user.email,
            password: plainPassword,
        });

        return {
            success: true,
            message: "Signed up successfully",
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            success: false,
            message: formatError(error),
        };
    }
}

// Get user by id
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User does not exist");
    }

    return user;
}

// Update user address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();

        const user = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        })
        if (!user) {
            throw new Error("User does not exist");
        }

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
           where: { id: user.id },
           data: { address },
        });

        return {
            success: true,
            message: "Address updated successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }
}
