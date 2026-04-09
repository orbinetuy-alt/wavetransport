import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

/**
 * Obtiene el rol del usuario leyendo directamente publicMetadata del backend de Clerk.
 * No depende del session token customizado.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // currentUser() llama al backend de Clerk — siempre tiene publicMetadata actualizado
  const user = await currentUser();
  if (!user) return null;

  return (user.publicMetadata as { role?: UserRole })?.role ?? "CLIENT";
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
