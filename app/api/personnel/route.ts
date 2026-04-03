import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { personnelCreateSchema } from "@/lib/validations";

export async function GET() {
  const rows = await prisma.personnel.findMany({
    include: { office: true, department: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = personnelCreateSchema.parse(body);
    const created = await prisma.personnel.create({ data: parsed });
    await prisma.auditLog.create({
      data: { entityType: "Personnel", entityId: created.id, action: "CREATE", description: `Added ${created.employeeCode}` }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save personnel." }, { status: 400 });
  }
}
