import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { equipmentCreateSchema } from "@/lib/validations";
import { nextHumanId } from "@/lib/ids";

export async function GET() {
  const rows = await prisma.equipment.findMany({
    include: { office: true, department: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.equipment.count();
    const parsed = equipmentCreateSchema.parse({ ...body, assetId: body.assetId || nextHumanId("EQ", count) });
    const created = await prisma.equipment.create({ data: parsed });
    await prisma.auditLog.create({
      data: { entityType: "Equipment", entityId: created.id, action: "CREATE", description: `Created ${created.assetId}` }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to create equipment." }, { status: 400 });
  }
}
