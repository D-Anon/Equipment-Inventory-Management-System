import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { maintenanceCreateSchema } from "@/lib/validations";
import { nextHumanId } from "@/lib/ids";

export async function GET() {
  const rows = await prisma.maintenanceLog.findMany({
    include: { equipment: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = maintenanceCreateSchema.parse(body);
    const count = await prisma.maintenanceLog.count();
    const maintenanceId = nextHumanId("MNT", count);

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.maintenanceLog.create({
        data: {
          maintenanceId,
          issue: parsed.issue,
          technician: parsed.technician,
          status: parsed.status,
          remarks: parsed.remarks,
          equipmentId: parsed.equipmentId
        }
      });

      await tx.equipment.update({
        where: { id: parsed.equipmentId },
        data: { status: parsed.status === "Repaired" ? "Available" : "Under Repair" }
      });

      await tx.auditLog.create({
        data: { entityType: "Maintenance", entityId: row.id, action: "CREATE", description: `Saved ${maintenanceId}` }
      });

      return row;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save maintenance." }, { status: 400 });
  }
}
