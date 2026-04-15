import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
import { Navbar } from "@/components/landing/Navbar";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const role = await getCurrentUserRole();
    if (role === "ADMIN") redirect("/admin");
    if (role === "DRIVER") redirect("/driver");
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Landing en construcción</p>
      </div>
    </main>
  );
}

