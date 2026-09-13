import type { AuthUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";

export const labourBackupInclude = {
  assignedSite: {
    select: {
      id: true,
      name: true,
      city: true,
      state: true,
      location: true
    }
  },
  contractor: {
    select: {
      id: true,
      name: true,
      companyName: true,
      phone: true,
      email: true
    }
  }
} satisfies Prisma.LabourInclude;

type LabourBackupModel = Prisma.LabourGetPayload<{
  include: typeof labourBackupInclude;
}>;

type LabourBackupAction = "created" | "updated" | "deleted";

type LabourBackupPayload = {
  action: LabourBackupAction;
  labour: LabourBackupModel;
  previous?: LabourBackupModel | null;
  actor: AuthUser;
};

function getBackupConfig() {
  const user = process.env.LABOUR_BACKUP_GMAIL_USER?.trim();
  const pass = process.env.LABOUR_BACKUP_GMAIL_APP_PASSWORD?.trim();
  const to = process.env.LABOUR_BACKUP_EMAIL_TO?.trim() || user;
  const fromName = process.env.LABOUR_BACKUP_FROM_NAME?.trim() || "Moonext Labour Backup";

  if (!user || !pass || !to) {
    return null;
  }

  return {
    user,
    pass,
    to,
    fromName
  };
}

function maskAadhaar(value: string) {
  return value.length === 12 ? `********${value.slice(-4)}` : value;
}

function serializeLabour(labour: LabourBackupModel) {
  return {
    id: labour.id,
    workerCode: labour.workerCode || null,
    fullName: labour.fullName,
    phone: labour.phone,
    aadhaarNumberMasked: maskAadhaar(labour.aadhaarNumber),
    skillType: labour.skillType,
    paymentCycle: labour.paymentCycle,
    dailyWage: Number(labour.dailyWage),
    monthlyWage: labour.monthlyWage ? Number(labour.monthlyWage) : null,
    status: labour.status,
    address: labour.address || null,
    emergencyContact: labour.emergencyContact || null,
    aadhaarDocUrl: labour.aadhaarDocUrl || null,
    photoUrl: labour.photoUrl || null,
    assignedSite: labour.assignedSite
      ? {
          id: labour.assignedSite.id,
          name: labour.assignedSite.name,
          city: labour.assignedSite.city,
          state: labour.assignedSite.state,
          location: labour.assignedSite.location || null
        }
      : null,
    contractor: labour.contractor
      ? {
          id: labour.contractor.id,
          name: labour.contractor.name,
          companyName: labour.contractor.companyName || null,
          phone: labour.contractor.phone,
          email: labour.contractor.email || null
        }
      : null,
    createdAt: labour.createdAt.toISOString(),
    updatedAt: labour.updatedAt.toISOString()
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatAction(action: LabourBackupAction) {
  switch (action) {
    case "created":
      return "created";
    case "updated":
      return "updated";
    case "deleted":
      return "deleted";
  }
}

export async function sendLabourBackupEmail({ action, labour, previous, actor }: LabourBackupPayload) {
  const config = getBackupConfig();
  if (!config) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  const currentSnapshot = serializeLabour(labour);
  const previousSnapshot = previous ? serializeLabour(previous) : null;
  const timestamp = new Date().toISOString();
  const subject = `[Moonext LMS] Labour ${formatAction(action)} - ${labour.fullName}`;
  const payload = {
    action,
    timestamp,
    actor: {
      id: actor.id,
      fullName: actor.fullName,
      email: actor.email,
      role: actor.role
    },
    labour: currentSnapshot,
    previous: previousSnapshot
  };

  const text = [
    `Labour record ${formatAction(action)} in Moonext Labour Management System.`,
    "",
    `Timestamp: ${timestamp}`,
    `Actor: ${actor.fullName} (${actor.email})`,
    `Role: ${actor.role}`,
    "",
    "Current snapshot:",
    JSON.stringify(currentSnapshot, null, 2),
    previousSnapshot
      ? ["", "Previous snapshot:", JSON.stringify(previousSnapshot, null, 2)].join("\n")
      : ""
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">Labour record ${escapeHtml(formatAction(action))}</h2>
      <p style="margin-top: 0;">This is an automatic Gmail backup from Moonext Labour Management System.</p>
      <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
      <p><strong>Actor:</strong> ${escapeHtml(actor.fullName)} (${escapeHtml(actor.email)})</p>
      <p><strong>Role:</strong> ${escapeHtml(actor.role)}</p>
      <p><strong>Labour:</strong> ${escapeHtml(labour.fullName)}</p>
      <p><strong>Site:</strong> ${escapeHtml(labour.assignedSite?.name || "-")}</p>
      <p><strong>Contractor:</strong> ${escapeHtml(labour.contractor?.name || "-")}</p>
      <h3>Current Snapshot</h3>
      <pre style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${escapeHtml(
        JSON.stringify(currentSnapshot, null, 2)
      )}</pre>
      ${
        previousSnapshot
          ? `<h3>Previous Snapshot</h3><pre style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">${escapeHtml(
              JSON.stringify(previousSnapshot, null, 2)
            )}</pre>`
          : ""
      }
    </div>
  `;

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.user}>`,
    to: config.to,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `labour-${action}-${labour.id}.json`,
        content: JSON.stringify(payload, null, 2),
        contentType: "application/json"
      }
    ]
  });

  return true;
}
