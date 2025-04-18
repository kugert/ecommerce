"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema, updateUserSchema,
} from "@/lib/validators";
import {auth, signIn, signOut} from "@/auth-server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "@/lib/utils";
import {ShippingAddress} from "@/types";
import {z} from "zod";
import {PAGE_SIZE} from "@/lib/constants";
import {revalidatePath} from "next/cache";
import { Prisma } from "@prisma/client";

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
  try {
    const user = await prisma.user.findFirst({
      where: {id: userId},
    });
    if (!user) throw new Error("User does not exist");

    return user;
  } catch {
    return;
  }
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

// Update user payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();
        const user = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });
        if (!user) throw new Error("User does not exist");

        const paymentMethod = paymentMethodSchema.parse(data);

        await prisma.user.update({
            where: { id: user.id },
            data: { paymentMethod: paymentMethod.type },
        });

        return {
            success: true,
            message: "Payment method updated successfully",
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}

// Update user profile
export async function updateUserProfile(user: { name: string; email: string; }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User does not exist");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: user.name,
      }
    })

    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    return {
        success: false,
        message: formatError(error),
    };
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query?: string;
}) {
  const queryFilter: Prisma.UserWhereInput = query && query !== "all" ? {
    name: {
      contains: query,
      mode: "insensitive",
    } as Prisma.StringFilter,
  } : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    if (!session || session?.user?.role !== "admin") throw new Error("Unable to delete user");
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
