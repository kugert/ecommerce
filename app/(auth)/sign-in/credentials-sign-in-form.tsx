"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { SIGN_IN_DEFAULT_VALUES } from "@/lib/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { signInWithCredentials } from "@/lib/actions/user.actions";

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: "",
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const SignInButton = () => {
        const { pending } = useFormStatus();

        return (
            <Button disabled={pending} className="w-full" variant="default">
                {pending ? "Signing in..." : "Sign In"}
            </Button>
        );
    };

    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        defaultValue={SIGN_IN_DEFAULT_VALUES.email}
                    />

                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="password"
                        defaultValue={SIGN_IN_DEFAULT_VALUES.password}
                    />
                </div>
                <div>
                    <SignInButton />
                </div>

                { data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message}
                    </div>
                )}

                <div className="text-sm text-center text-muted-foreground">
                    Don&#39;t have an account?{" "}
                    <Link href="/sign-up" target="_self" className="link">
                        Sign Up
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default CredentialsSignInForm;