import { auth } from "@/auth-server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return session;
}
