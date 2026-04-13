# WaveTransport — Guía de desarrollo

Plataforma de gestión y reservas para una empresa de transporte/turismo en Portugal.
Automatiza el flujo de pagos y liquidaciones a choferes mediante Stripe Connect.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Base de datos | Neon PostgreSQL (serverless) |
| ORM | Prisma 7 con `@prisma/adapter-neon` |
| Auth | Clerk v7 |
| Pagos | Stripe Connect Express |
| Estilos | Tailwind CSS v4 (config en `globals.css` via `@theme`) |
| Deploy | Vercel → `wavetransports.vercel.app` |
| Repo | `github.com/orbinetuy-alt/wavetransport` |

---

## Comandos esenciales

```bash
npm run dev          # Servidor local en localhost:3000
npm run build        # Build de producción (incluye prisma generate)
npx prisma studio    # GUI para ver/editar la base de datos
npx prisma migrate dev --name nombre   # Crear nueva migración
git add . && git commit -m "mensaje" && git push  # Subir cambios (Vercel redeploya automáticamente)
```

---

## Variables de entorno

El archivo `.env` está en `.gitignore` — nunca se sube a GitHub.
Para producción, las variables se configuran en Vercel → Settings → Environment Variables.

```env
DATABASE_URL=          # String de conexión Neon
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=  # Desde dashboard.clerk.com → Webhooks
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET= # Desde dashboard.stripe.com → Webhooks
NEXT_PUBLIC_APP_URL=https://wavetransports.vercel.app
```

---

## Arquitectura de rutas

```
src/app/
├── page.tsx                    ← Redirect según rol (ADMIN→/admin, DRIVER→/driver)
├── (admin)/
│   ├── layout.tsx              ← requireRole("ADMIN") + AdminSidebar
│   └── admin/
│       └── page.tsx            ← Dashboard con stats de DB
├── (driver)/
│   ├── layout.tsx              ← requireRole("DRIVER") + DriverNav
│   └── driver/
│       ├── page.tsx            ← Dashboard del chofer
│       ├── trips/page.tsx      ← Historial de viajes
│       ├── settlements/page.tsx← Liquidaciones
│       └── settings/page.tsx   ← Perfil + Stripe Connect
├── (client)/                   ← (vacío, pendiente)
├── (public)/                   ← (vacío, pendiente)
├── sign-in/                    ← Clerk sign in
├── sign-up/                    ← Clerk sign up
├── unauthorized/               ← Página de acceso denegado
└── api/
    ├── webhooks/
    │   ├── stripe/route.ts     ← Maneja 7 eventos de Stripe
    │   └── clerk/route.ts      ← Crea Driver en DB al registrarse
    ├── stripe/
    │   ├── checkout/route.ts   ← Crea Stripe Checkout Session + Booking
    │   └── onboard/route.ts    ← Crea cuenta Express + link de onboarding
    └── debug/route.ts          ← Utilidad: muestra userId, rol, y si existe Driver en DB
```

---

## Base de datos (Prisma Schema)

### Modelos

**`Driver`** — Chofer registrado en la plataforma
- `clerkUserId` — vinculado al usuario de Clerk
- `stripeAccountId` — cuenta Express de Stripe Connect (`acct_xxx`)
- `commissionPercent` — % del viaje que recibe el chofer (ej: 75 → chofer 75%, empresa 25%)
- `payoutFrequency` — WEEKLY / BIWEEKLY / MONTHLY

**`Service`** — Tipo de viaje (transfer aeropuerto, tour, etc.)
- `basePrice` — precio base en EUR
- `isActive` — si aparece disponible para reservar

**`Booking`** — Reserva de un viaje
- Vincula cliente (Clerk o guest) + servicio + chofer asignado
- `stripePaymentIntentId` — para rastrear el pago
- Estados: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED / CANCELLED

**`Settlement`** — Liquidación de un viaje completado
- Detalla: `grossAmountCents`, `driverAmountCents`, `platformFeeCents`, `stripeFeeCents`
- Estados: PENDING → AVAILABLE → TRANSFERRED → PAID_OUT → RECONCILED

**`Payout`** — Agrupación de varios settlements en un pago periódico al chofer

**`StripeWebhookEvent`** — Registro idempotente de eventos procesados de Stripe

### Enums relevantes
```
BookingStatus:    PENDING | CONFIRMED | IN_PROGRESS | COMPLETED | CANCELLED | NO_SHOW
PaymentStatus:    PENDING | PAID | REFUNDED | PARTIALLY_REFUNDED | DISPUTED | FAILED
SettlementStatus: PENDING | AVAILABLE | TRANSFERRED | PAID_OUT | RECONCILED | ON_HOLD
PayoutFrequency:  WEEKLY | BIWEEKLY | MONTHLY
```

---

## Librerías clave (`src/lib/`)

### `auth.ts`
```ts
getCurrentUserRole()   // Lee rol desde publicMetadata de Clerk (llama al backend)
requireRole("ADMIN")   // Redirige a /unauthorized si el rol no coincide
requireAdminOrDriver() // Permite ADMIN o DRIVER
```

### `driver.ts`
```ts
getOrCreateDriver(clerkUserId)
// Busca el Driver en DB. Si no existe, lo crea con datos de Clerk.
// Usado en todas las páginas del panel chofer para auto-provisionar el registro.
// El admin configura commissionPercent después.
```

### `stripe.ts`
```ts
stripe                          // Cliente Stripe (API 2026-03-25.dahlia)
calculateTripDistribution({     // Calcula distribución del pago
  grossAmountCents,
  commissionPercent             // → { driverAmountCents, platformFeeCents, ... }
})
centsToEuros(cents)             // 1500 → 15.00
eurosToCents(euros)             // 15.00 → 1500
```

### `prisma.ts`
```ts
prisma  // PrismaClient con adaptador Neon (requerido por Prisma 7)
```

---

## Sistema de roles y auth

Los roles se guardan en `publicMetadata` de Clerk (se editan desde el dashboard de Clerk → usuario → Edit metadata):

```json
{ "role": "ADMIN" }
{ "role": "DRIVER" }
{ "role": "CLIENT" }  // por defecto si no tiene rol
```

El middleware (`src/middleware.ts`) usa `clerkMiddleware`. Rutas públicas definidas con `createRouteMatcher`.

---

## Diseño / Design System

**Fuente:** Plus Jakarta Sans (300–800) — importada desde Google Fonts en `layout.tsx`

**Paleta** (definida en `globals.css` via `@theme`):
```css
--color-surface-base:   #0d1b2e  /* fondo principal */
--color-surface-card:   #132338  /* cards */
--color-surface-raised: #1a2e45  /* hover */
--color-surface-border: #243d58  /* bordes */
--color-brand-500:      #0e81b8  /* teal principal */
--color-text-primary:   #ffffff
--color-text-secondary: #a8c4db
--color-text-muted:     #5c7d96
```

**Regla importante:** Tailwind v4 no usa `tailwind.config.ts`. Todo se configura en `globals.css` con `@theme inline { }`. No crear `tailwind.config.ts`.

**Componentes UI disponibles:**
- `src/components/ui/StatCard.tsx` — tarjeta de métrica con icono, valor, tendencia
- `src/components/ui/StatusBadge.tsx` — badge de color para todos los estados del sistema
- `src/components/admin/AdminSidebar.tsx` — sidebar fijo con navegación y logo
- `src/components/admin/AdminHeader.tsx` — header con título y subtítulo
- `src/components/driver/DriverNav.tsx` — sidebar en desktop + bottom nav en mobile
- `src/components/driver/DriverHeader.tsx` — header del panel chofer
- `src/components/driver/StripeOnboardingButton.tsx` — botón de onboarding a Stripe Connect

---

## Webhooks configurados

### Clerk → `https://wavetransports.vercel.app/api/webhooks/clerk`
Eventos: `user.created`, `user.updated`, `user.deleted`
- Cuando un nuevo usuario tiene `role: "DRIVER"` en metadata, crea automáticamente el registro `Driver` en la DB.

### Stripe → `https://wavetransports.vercel.app/api/webhooks/stripe`
Eventos: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, `charge.dispute.created`, `transfer.created`, `payout.paid`, `account.updated`

---

## Flujo de pago (cómo funciona)

```
1. Cliente hace reserva → POST /api/stripe/checkout
   └── Crea Booking (PENDING) + Stripe Checkout Session

2. Cliente paga en Stripe →
   └── Webhook: checkout.session.completed
       └── Booking pasa a CONFIRMED, Settlement creado (PENDING)

3. Viaje se completa →
   └── Admin marca Booking como COMPLETED
       └── Settlement pasa a AVAILABLE

4. Admin dispara liquidación →
   └── Stripe Transfer a cuenta Connect del chofer
       └── Settlement pasa a TRANSFERRED

5. Stripe hace payout al banco del chofer →
   └── Webhook: payout.paid
       └── Settlement pasa a PAID_OUT
```

---

## Cómo añadir una nueva página

### En el panel admin
1. Crear `src/app/(admin)/admin/NOMBRE/page.tsx`
2. Importar `requireRole` no hace falta — ya lo hace el layout padre
3. Añadir el link en `src/components/admin/AdminSidebar.tsx`

### En el panel chofer
1. Crear `src/app/(driver)/driver/NOMBRE/page.tsx`
2. Usar `getOrCreateDriver(userId)` para obtener el Driver de DB
3. Añadir el link en `src/components/driver/DriverNav.tsx`

### Nueva ruta API
1. Crear `src/app/api/NOMBRE/route.ts`
2. Exportar funciones `GET`, `POST`, `PUT`, `DELETE` según necesidad
3. Para rutas protegidas usar `await requireRole("ADMIN")` al inicio

---

## Pendiente de implementar

### Panel Admin
- [ ] `/admin/drivers` — lista de choferes, editar comisión %, activar/desactivar, ver perfil
- [ ] `/admin/bookings` — lista con filtros por estado/fecha, cambiar estado, asignar chofer
- [ ] `/admin/settlements` — ver settlements pendientes, disparar transferencia Stripe Connect
- [ ] `/admin/services` — CRUD de servicios y precios

### Público / Cliente
- [ ] `/` — Landing page de Wave Transports
- [ ] `/services` — catálogo de servicios disponibles con precios
- [ ] Formulario de reserva con Stripe Checkout + login gate de Clerk
- [ ] `/booking/success` — confirmación tras pago exitoso
- [ ] `/booking/cancel` — página de cancelación

### Infraestructura
- [ ] Cron job de liquidaciones semanales (Vercel Cron en `vercel.json`)
- [ ] Activar modo producción en Stripe (verificación de negocio)
- [ ] Página de gestión de roles (para asignar DRIVER desde el admin sin entrar al dashboard de Clerk)
