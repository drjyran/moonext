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
- Material management
- Payment tracking
- AI labour forecasting insights

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Make sure PostgreSQL is running and the database referenced by `DATABASE_URL` already exists.
4. Run Prisma migrations + generate:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Seed sample data:
   ```bash
   npm run prisma:seed
   ```
6. Start app:
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

## Gmail Backup For Labour Updates
If you want labour create, update, and delete actions emailed to Gmail as backup:

1. Enable 2-Step Verification on the Gmail account.
2. Create a Gmail App Password.
3. Set these environment variables:
   ```bash
   LABOUR_BACKUP_GMAIL_USER=your-backup-gmail@gmail.com
   LABOUR_BACKUP_GMAIL_APP_PASSWORD=your-16-char-gmail-app-password
   LABOUR_BACKUP_EMAIL_TO=your-backup-gmail@gmail.com
   LABOUR_BACKUP_FROM_NAME="Moonext Labour Backup"
   ```
4. Restart the app or redeploy on Vercel.

Notes:
- Labour create, update, and delete APIs remain the primary workflow.
- Backup email failures are logged but do not block labour changes.
- Aadhaar is masked in the backup email for safer handling.

### Production DB migration
```bash
npx prisma migrate deploy
```

## Project Structure
- `app/(auth)/login`: login UI
- `app/(dashboard)/*`: dashboard modules
- `app/api/*`: backend APIs
- `lib/*`: auth, prisma, API guards, utils
- `prisma/schema.prisma`: database models
- `prisma/seed.ts`: sample seed data
# moonext
