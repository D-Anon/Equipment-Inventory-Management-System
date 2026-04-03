import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { equipmentUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = equipmentUpdateSchema.parse({ ...body, id });

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        assetId: parsed.assetId,
        name: parsed.name,
        category: parsed.category,
        brand: parsed.brand,
        model: parsed.model,
        serialNumber: parsed.serialNumber,
        condition: parsed.condition,
        status: parsed.status,
        location: parsed.location,
        assignedTo: parsed.assignedTo,
        remarks: parsed.remarks,
        officeId: parsed.officeId,
        departmentId: parsed.departmentId
      }
    });

    await prisma.auditLog.create({
      data: { entityType: "Equipment", entityId: id, action: "UPDATE", description: `Updated ${updated.assetId}` }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to update equipment." }, { status: 400 });
  }
}
