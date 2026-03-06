# Moonext Labour Management System

Full-stack Labour Management System for **Moonext Constructions Pvt Ltd**.

## Stack
- Next.js (App Router) + Tailwind CSS
- Prisma ORM + PostgreSQL
- JWT auth with role-based access control (Admin, Site Manager, Contractor)
- API routes in Next.js

## Features
- Role-based login/logout
- Multi-site management
- Labour and contractor management
- Daily/bulk attendance
- Wage calculation from attendance
- Payroll CSV export
- Dashboard analytics
- Reports filters
- Seed data
- Optional placeholders: OTP, uploads, SMS integration

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run Prisma migrations + generate:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Seed sample data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Demo Credentials
- Admin: `admin@moonext.in` / `Admin@123`
- Site Manager: `manager@moonext.in` / `Admin@123`
- Contractor: `contractor@moonext.in` / `Admin@123`

## Deployment (Vercel)
1. Push repository to GitHub.
2. Import project in Vercel.
3. Set `DATABASE_URL` and `JWT_SECRET` environment variables.
4. Run build command: `npm run build`.
5. Add post-deploy migration step via CI or manual `prisma migrate deploy`.

## Project Structure
- `app/(auth)/login`: login UI
- `app/(dashboard)/*`: dashboard modules
- `app/api/*`: backend APIs
- `lib/*`: auth, prisma, API guards, utils
- `prisma/schema.prisma`: database models
- `prisma/seed.ts`: sample seed data
