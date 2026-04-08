import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

// ─────────────────────────────────────────────
// Helpers financieros
// ─────────────────────────────────────────────

/**
 * Calcula la distribución del pago de un viaje.
 * Todos los montos en centavos (integer) para evitar errores de float.
 */
export function calculateTripDistribution({
  grossAmountCents,
  commissionPercent, // % que recibe el CHOFER (ej: 75 → chofer 75%, empresa 25%)
}: {
  grossAmountCents: number;
  commissionPercent: number;
}) {
  const driverAmountCents = Math.round((grossAmountCents * commissionPercent) / 100);
  const platformFeeCents = grossAmountCents - driverAmountCents;

  return {
    grossAmountCents,
    driverAmountCents,
    platformFeeCents,
    // El fee de Stripe se actualiza post-cobro desde el webhook
    stripeFeeCents: 0,
    netAmountCents: platformFeeCents,
  };
}

/**
 * Convierte centavos a euros con 2 decimales.
 */
export function centsToEuros(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Convierte euros a centavos (entero).
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}
