import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettlementsClient } from "./SettlementsClient";

export default async function AdminSettlementsPage() {
  const [settlements, stats] = await Promise.all([
    prisma.settlement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            clientName: true,
            pickupDatetime: true,
            paymentStatus: true,
            service: { select: { name: true } },
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            stripeAccountId: true,
            stripeChargesEnabled: true,
          },
        },
      },
    }),
    prisma.settlement.groupBy({
      by: ["status"],
      _sum: { driverAmountCents: true },
      _count: { id: true },
    }),
  ]);

  function sumCents(statuses: string[]) {
    return stats
      .filter((s) => statuses.includes(s.status))
      .reduce((acc, s) => acc + (s._sum.driverAmountCents ?? 0), 0);
  }

  function countStatus(status: string) {
    return stats.find((s) => s.status === status)?._count?.id ?? 0;
  }

  return (
    <>
      <AdminHeader
        title="Liquidaciones"
        subtitle="Genera, revisa y transfiere pagos a los choferes"
      />
      <div className="p-8">
        <SettlementsClient
          settlements={settlements as any}
          pendingCents={sumCents(["PENDING"])}
          availableCents={sumCents(["AVAILABLE"])}
          transferredCents={sumCents(["TRANSFERRED", "PAID_OUT", "RECONCILED"])}
          pendingCount={countStatus("PENDING")}
        />
      </div>
    </>
  );
}
