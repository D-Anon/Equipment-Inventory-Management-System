import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminOffice = await prisma.office.upsert({
    where: { name: "Admin Office" },
    update: {},
    create: { name: "Admin Office" }
  });

  const computerLab = await prisma.office.upsert({
    where: { name: "Computer Lab" },
    update: {},
    create: { name: "Computer Lab" }
  });

  const ict = await prisma.department.upsert({
    where: { name: "ICT" },
    update: {},
    create: { name: "ICT" }
  });

  const equipment = await prisma.equipment.upsert({
    where: { assetId: "EQ-0001" },
    update: {},
    create: {
      assetId: "EQ-0001",
      name: "Desktop Computer",
      category: "Desktop",
      brand: "Dell",
      model: "OptiPlex",
      serialNumber: "SN-001",
      condition: "Good",
      status: "Available",
      officeId: computerLab.id,
      departmentId: ict.id
    }
  });

  const supply = await prisma.supply.upsert({
    where: { supplyId: "SUP-0001" },
    update: {},
    create: {
      supplyId: "SUP-0001",
      itemName: "Bond Paper A4",
      category: "Office Supplies",
      unit: "Ream",
      stockOnHand: 20,
      reorderLevel: 10,
      officeId: adminOffice.id
    }
  });

  await prisma.personnel.upsert({
    where: { employeeCode: "EMP-0001" },
    update: {},
    create: {
      employeeCode: "EMP-0001",
      fullName: "Juan Dela Cruz",
      email: "juan@example.com",
      position: "Inventory Staff",
      officeId: adminOffice.id,
      departmentId: ict.id
    }
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { fullName: "System Admin", email: "admin@example.com", role: "Admin" }
  });

  await prisma.setting.upsert({
    where: { key: "system_name" },
    update: { value: "Equipment Inventory" },
    create: { key: "system_name", value: "Equipment Inventory" }
  });

  await prisma.supplyTransaction.upsert({
    where: { transactionId: "STXN-0001" },
    update: {},
    create: {
      transactionId: "STXN-0001",
      type: "OUT",
      quantity: 2,
      requestedBy: "Juan Dela Cruz",
      supplyIdRef: supply.id,
      officeId: adminOffice.id
    }
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Equipment",
      entityId: equipment.id,
      action: "SEED_CREATED",
      description: "Initial equipment seed record",
      actorName: "Seeder"
    }
  });
}

main().finally(async () => prisma.$disconnect());
