import { PrismaClient, Role, LabourStatus, AttendanceStatus, PaymentStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.wageRecord.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.labour.deleteMany();
  await prisma.user.deleteMany();
  await prisma.site.deleteMany();
  await prisma.contractor.deleteMany();

  const password = await hash("Admin@123", 10);

  const contractor = await prisma.contractor.create({
    data: {
      name: "Sharma Infra Services",
      phone: "9898989898",
      email: "sharma@contractor.in",
      address: "Bhopal, Madhya Pradesh"
    }
  });

  const site = await prisma.site.create({
    data: {
      name: "Moonext Skyline Residency",
      state: "Madhya Pradesh",
      city: "Bhopal",
      projectStart: new Date("2026-01-01"),
      projectEnd: new Date("2026-12-31")
    }
  });

  const admin = await prisma.user.create({
    data: {
      fullName: "System Admin",
      email: "admin@moonext.in",
      passwordHash: password,
      role: Role.ADMIN,
      phone: "9000000001"
    }
  });

  const siteManager = await prisma.user.create({
    data: {
      fullName: "Rajesh Yadav",
      email: "manager@moonext.in",
      passwordHash: password,
      role: Role.SITE_MANAGER,
      phone: "9000000002",
      siteId: site.id
    }
  });

  const contractorUser = await prisma.user.create({
    data: {
      fullName: "Amit Sharma",
      email: "contractor@moonext.in",
      passwordHash: password,
      role: Role.CONTRACTOR,
      phone: "9000000003",
      contractorId: contractor.id
    }
  });

  await prisma.site.update({ where: { id: site.id }, data: { siteManagerId: siteManager.id } });

  const labour1 = await prisma.labour.create({
    data: {
      fullName: "Ramesh Patel",
      phone: "9012345671",
      aadhaarNumber: "111122223333",
      skillType: "Mason",
      dailyWage: 800,
      contractorId: contractor.id,
      assignedSiteId: site.id,
      status: LabourStatus.ACTIVE
    }
  });

  const labour2 = await prisma.labour.create({
    data: {
      fullName: "Suresh Verma",
      phone: "9012345672",
      aadhaarNumber: "444455556666",
      skillType: "Helper",
      dailyWage: 550,
      contractorId: contractor.id,
      assignedSiteId: site.id,
      status: LabourStatus.ACTIVE
    }
  });

  await prisma.attendance.createMany({
    data: [
      { labourId: labour1.id, siteId: site.id, date: new Date("2026-03-01"), status: AttendanceStatus.PRESENT },
      { labourId: labour2.id, siteId: site.id, date: new Date("2026-03-01"), status: AttendanceStatus.HALF_DAY }
    ]
  });

  await prisma.wageRecord.create({
    data: {
      labourId: labour1.id,
      siteId: site.id,
      contractorId: contractor.id,
      month: 3,
      year: 2026,
      presentDays: 1,
      grossAmount: 800,
      paidAmount: 0,
      pendingAmount: 800,
      paymentStatus: PaymentStatus.PENDING
    }
  });

  console.log("Seed completed", { admin: admin.email, siteManager: siteManager.email, contractor: contractorUser.email });
}

main().finally(async () => prisma.$disconnect());
