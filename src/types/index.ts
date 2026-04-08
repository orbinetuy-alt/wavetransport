// ─────────────────────────────────────────────
// WaveTransport — Tipos compartidos
// ─────────────────────────────────────────────

export type UserRole = "ADMIN" | "DRIVER" | "CLIENT";

export interface TripDistribution {
  grossAmountCents: number;
  driverAmountCents: number;
  platformFeeCents: number;
  stripeFeeCents: number;
  netAmountCents: number;
}

export interface DriverWithStats {
  id: string;
  name: string;
  email: string;
  commissionPercent: number;
  stripeOnboardingDone: boolean;
  stripePayoutsEnabled: boolean;
  isActive: boolean;
  totalEarnedCents: number;
  pendingSettlementCents: number;
}

export interface BookingSummary {
  id: string;
  clientName: string;
  clientEmail: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: Date;
  grossAmountCents: number;
  driverAmountCents: number;
  status: string;
  paymentStatus: string;
  driverName?: string;
}
