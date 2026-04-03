import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supplyUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = supplyUpdateSchema.parse({ ...body, id });

    const updated = await prisma.supply.update({
      where: { id },
      data: {
        supplyId: parsed.supplyId,
        itemName: parsed.itemName,
        category: parsed.category,
        unit: parsed.unit,
        stockOnHand: parsed.stockOnHand,
        reorderLevel: parsed.reorderLevel,
        remarks: parsed.remarks,
        officeId: parsed.officeId
      }
    });

    await prisma.auditLog.create({
      data: { entityType: "Supply", entityId: id, action: "UPDATE", description: `Updated ${updated.supplyId}` }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to update supply." }, { status: 400 });
  }
}
