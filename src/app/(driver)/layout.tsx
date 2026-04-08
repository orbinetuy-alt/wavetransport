import { requireRole } from "@/lib/auth";
import { DriverNav } from "@/components/driver/DriverNav";

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("DRIVER");

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--color-surface-base)" }}>
      <DriverNav />

      {/* Contenido — en desktop tiene offset del sidebar, en mobile tiene padding del bottom nav */}
      <div className="flex flex-col flex-1 lg:ml-60 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
