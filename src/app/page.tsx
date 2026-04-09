import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const role = await getCurrentUserRole();
    if (role === "ADMIN") redirect("/admin");
    if (role === "DRIVER") redirect("/driver");
  }

  redirect("/sign-in");
}

