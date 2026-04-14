import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY not set — emails will be skipped");
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "WaveTransports <noreply@wavetransports.pt>";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

// ─────────────────────────────────────────────
// Email: Nuevo viaje asignado al chofer
// ─────────────────────────────────────────────
export async function sendTripAssignedEmail(params: {
  driverName: string;
  driverEmail: string;
  clientName: string;
  serviceName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: string;
  passengers: number;
  driverAmountCents: number;
  notes?: string | null;
}) {
  if (!resend) return;

  const {
    driverName, driverEmail, clientName, serviceName,
    pickupAddress, dropoffAddress, pickupDatetime,
    passengers, driverAmountCents, notes,
  } = params;

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo viaje asignado</title>
</head>
<body style="margin:0;padding:0;background:#0d1b2e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1b2e;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
                🌊 WaveTransports
              </p>
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td style="background:#132338;border-radius:16px;padding:32px;border:1px solid #243d58;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0e81b8;text-transform:uppercase;letter-spacing:1px;">
                Nuevo viaje asignado
              </p>
              <h1 style="margin:0 0 4px;font-size:24px;font-weight:700;color:#ffffff;">
                Hola, ${driverName} 👋
              </h1>
              <p style="margin:0;font-size:15px;color:#a8c4db;">
                Te han asignado un nuevo viaje. Estos son los detalles:
              </p>

              <!-- Divider -->
              <div style="height:1px;background:#243d58;margin:24px 0;"></div>

              <!-- Detalles del viaje -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">SERVICIO</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${serviceName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">CLIENTE</p>
                    <p style="margin:0;font-size:16px;color:#a8c4db;">${clientName} · ${passengers} pasajero${passengers !== 1 ? "s" : ""}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">FECHA Y HORA</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#ffffff;">${formatDate(pickupDatetime)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">RECOGIDA</p>
                    <p style="margin:0;font-size:15px;color:#ffffff;">📍 ${pickupAddress}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">DESTINO</p>
                    <p style="margin:0;font-size:15px;color:#ffffff;">🏁 ${dropoffAddress}</p>
                  </td>
                </tr>
                ${notes ? `
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">NOTAS</p>
                    <p style="margin:0;font-size:14px;color:#a8c4db;">${notes}</p>
                  </td>
                </tr>` : ""}
              </table>

              <!-- Ganancia destacada -->
              <div style="background:#1a2e45;border-radius:12px;padding:20px;margin-top:8px;border:1px solid #0e81b8;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#5c7d96;text-transform:uppercase;letter-spacing:0.8px;">TU GANANCIA</p>
                <p style="margin:0;font-size:28px;font-weight:800;color:#0e81b8;">${formatEuros(driverAmountCents)}</p>
              </div>

              <!-- Divider -->
              <div style="height:1px;background:#243d58;margin:24px 0;"></div>

              <!-- CTA -->
              <a href="https://wavetransports.vercel.app/driver"
                style="display:inline-block;background:#0e81b8;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;">
                Ver mis viajes →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#5c7d96;text-align:center;">
                WaveTransports · Portugal · Este es un mensaje automático, no respondas a este email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: FROM,
    to: driverEmail,
    subject: `🚗 Nuevo viaje: ${formatDate(pickupDatetime)} — ${pickupAddress}`,
    html,
  });
}

// ─────────────────────────────────────────────
// Email: Viaje desasignado (si el admin cambia el chofer)
// ─────────────────────────────────────────────
export async function sendTripUnassignedEmail(params: {
  driverName: string;
  driverEmail: string;
  pickupDatetime: string;
  pickupAddress: string;
}) {
  if (!resend) return;

  const { driverName, driverEmail, pickupDatetime, pickupAddress } = params;

  await resend.emails.send({
    from: FROM,
    to: driverEmail,
    subject: `ℹ️ Viaje cancelado: ${formatDate(pickupDatetime)}`,
    html: `
<!DOCTYPE html>
<html lang="pt">
<body style="margin:0;padding:32px 16px;background:#0d1b2e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="background:#132338;border-radius:16px;padding:32px;border:1px solid #243d58;">
        <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;">🌊 WaveTransports</p>
        <h2 style="margin:8px 0;color:#ffffff;">Hola, ${driverName}</h2>
        <p style="color:#a8c4db;">Se te ha desasignado el viaje del <strong style="color:#fff;">${formatDate(pickupDatetime)}</strong> desde <strong style="color:#fff;">${pickupAddress}</strong>.</p>
        <p style="color:#5c7d96;font-size:13px;">Contacta con la empresa si tienes dudas.</p>
        <a href="https://wavetransports.vercel.app/driver" style="display:inline-block;background:#0e81b8;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;margin-top:16px;">Ver mis viajes →</a>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
