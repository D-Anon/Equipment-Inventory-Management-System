import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supplyCreateSchema } from "@/lib/validations";
import { nextHumanId } from "@/lib/ids";

export async function GET() {
  const rows = await prisma.supply.findMany({
    include: { office: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = await prisma.supply.count();
    const parsed = supplyCreateSchema.parse({ ...body, supplyId: body.supplyId || nextHumanId("SUP", count) });
    const created = await prisma.supply.create({ data: parsed });
    await prisma.auditLog.create({
      data: { entityType: "Supply", entityId: created.id, action: "CREATE", description: `Created ${created.supplyId}` }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to create supply." }, { status: 400 });
  }
}
