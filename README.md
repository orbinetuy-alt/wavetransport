# WaveTransport

Plataforma de gestión y liquidación de viajes con Stripe Connect.

## Stack
- **Next.js 14** (App Router)
- **PostgreSQL** (Neon)
- **Prisma 7** (ORM)
- **Clerk** (autenticación + roles)
- **Stripe Connect Express** (pagos + liquidaciones)
- **Vercel** (deploy)

---

## Setup local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env.local
```
Completar con las claves reales (ver `.env.example`).

### 3. Base de datos (Neon)
1. Crear proyecto en [neon.tech](https://neon.tech)
2. Copiar la connection string al `.env.local` como `DATABASE_URL`
3. Correr migrations:
```bash
npx prisma migrate dev --name init
```

### 4. Clerk
1. Crear app en [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copiar claves al `.env.local`
3. En Clerk Dashboard → **Sessions** → **Customize session token**:
   - Agregar claim: `{ "metadata": "{{user.public_metadata}}" }`
   - Permite leer el `role` del usuario en el JWT

### 5. Stripe Connect
1. Activar **Connect** en [dashboard.stripe.com](https://stripe.com)
2. Copiar claves al `.env.local`
3. Webhooks locales:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copiar el `STRIPE_WEBHOOK_SECRET` generado al `.env.local`.

### 6. Correr el proyecto
```bash
npm run dev
```

---

## Webhooks de Stripe configurados

| Evento | Acción |
|---|---|
| `checkout.session.completed` | Marca booking PAGADO + CONFIRMADO |
| `payment_intent.succeeded` | Crea Settlement con montos reales |
| `charge.refunded` | Pone settlement en ON_HOLD |
| `charge.dispute.created` | Bloquea liquidación para auditoría |
| `transfer.created` | Marca settlement como TRANSFERRED |
| `payout.paid` | Cierra el ciclo: chofer cobró en su banco |
| `account.updated` | Actualiza estado de onboarding Connect del chofer |

---

## Roles

| Rol | Descripción |
|---|---|
| `ADMIN` | Acceso total: reservas, choferes, liquidaciones, reportes |
| `DRIVER` | Panel propio: viajes, ganancias, estado de pagos |
| `CLIENT` | Reserva y pago de viajes online |

Los roles se asignan en `publicMetadata` de Clerk:
```json
{ "role": "ADMIN" }
```

---

## Flujo de dinero

```
Cliente paga → Stripe Checkout
     ↓
checkout.session.completed → Booking CONFIRMED
     ↓
payment_intent.succeeded → Settlement creado (AVAILABLE)
     ↓
Corte semanal (cron job) → Transfer al chofer (Connect)
     ↓
transfer.created → Settlement TRANSFERRED
     ↓
payout.paid → Settlement PAID_OUT
```

---

## Cálculo de liquidación

```
Gross         = precio del viaje (lo que paga el cliente)
Driver amount = Gross × (commissionPercent / 100)
Platform fee  = Gross − Driver amount
Stripe fee    = fee real de Stripe (actualizado post-cobro)
Net platform  = Platform fee − Stripe fee
```

Cada chofer tiene su propio `commissionPercent` negociado individualmente.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
