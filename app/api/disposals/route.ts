import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { disposalCreateSchema } from "@/lib/validations";
import { nextHumanId } from "@/lib/ids";

export async function GET() {
  const rows = await prisma.disposal.findMany({
    include: { equipment: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = disposalCreateSchema.parse(body);
    const count = await prisma.disposal.count();
    const disposalId = nextHumanId("DSP", count);

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.disposal.create({
        data: {
          disposalId,
          reason: parsed.reason,
          status: parsed.status,
          approvedBy: parsed.approvedBy,
          remarks: parsed.remarks,
          equipmentId: parsed.equipmentId
        }
      });

      await tx.equipment.update({
        where: { id: parsed.equipmentId },
        data: { status: parsed.status === "Lost" ? "Lost" : "Retired" }
      });

      await tx.auditLog.create({
        data: { entityType: "Disposal", entityId: row.id, action: "CREATE", description: `Saved ${disposalId}` }
      });

      return row;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save disposal." }, { status: 400 });
  }
}
