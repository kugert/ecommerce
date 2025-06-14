"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { SIGN_UP_DEFAULT_VALUES } from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: "",
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const SignUpButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button disabled={pending} className="w-full" variant="default">
                {pending ? "Submitting..." : "Sign Up"}
            </Button>
        );
    };

    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        defaultValue={SIGN_UP_DEFAULT_VALUES.name}
                    />
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        defaultValue={SIGN_UP_DEFAULT_VALUES.email}
                    />

                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="password"
                        defaultValue={SIGN_UP_DEFAULT_VALUES.password}
                    />
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="confirmPassword"
                        defaultValue={SIGN_UP_DEFAULT_VALUES.confirmPassword}
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>

                { data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/sign-in" target="_self" className="link">
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default SignUpForm;
