import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

/**
 * Obtiene el rol del usuario desde Clerk publicMetadata.
 * Clerk publicMetadata: { role: "ADMIN" | "DRIVER" | "CLIENT" }
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;
  return (sessionClaims?.metadata as { role?: UserRole })?.role ?? "CLIENT";
}

/**
 * Protege una page/layout exigiendo un rol específico.
 * Redirige a /unauthorized si el rol no coincide.
 */
export async function requireRole(role: UserRole) {
  const userRole = await getCurrentUserRole();
  if (userRole !== role) {
    redirect("/unauthorized");
  }
}

/**
 * Protege varias pages exigiendo que el usuario sea ADMIN o DRIVER.
 */
export async function requireAdminOrDriver() {
  const userRole = await getCurrentUserRole();
  if (userRole !== "ADMIN" && userRole !== "DRIVER") {
    redirect("/unauthorized");
  }
}
