import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

import { NextResponse } from "next/server";

const config: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    providers: [],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorized({ request, auth }: any) {
            const protectedRoutes = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin\/(.*)/,
                /\/admin/,
            ];
            const { pathname } = request.nextUrl;

            if (!auth && protectedRoutes.some((path) => path.test(pathname))) return false;

            if (!request.cookies.get("sessionCartId")) {
                const sessionCartId = crypto.randomUUID();

                const newRequestHeaders = new Headers(request.headers);
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    }
                });

                response.cookies.set("sessionCartId", sessionCartId);

                return response;
            } else {
                return true;
            }
        }
    },
};

export const { auth } = NextAuth(config);
