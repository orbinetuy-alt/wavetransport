import { requireRole } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("ADMIN");

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--color-surface-base)" }}>
      <AdminSidebar />

      {/* Contenido principal (offset por el sidebar de 256px) */}
      <div className="flex flex-col flex-1 ml-64 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
