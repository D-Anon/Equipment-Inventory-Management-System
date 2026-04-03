import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transactionCreateSchema } from "@/lib/validations";
import { nextHumanId } from "@/lib/ids";

export async function GET() {
  const rows = await prisma.transaction.findMany({
    include: { equipment: true, office: true, department: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = transactionCreateSchema.parse(body);
    const count = await prisma.transaction.count();
    const transactionId = nextHumanId("TXN", count);

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.transaction.create({
        data: {
          transactionId,
          type: parsed.type,
          borrowerName: parsed.borrowerName,
          dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
          returnDate: parsed.type === "Return" ? new Date() : null,
          status: parsed.type === "Borrow" ? "Ongoing" : "Completed",
          remarks: parsed.remarks,
          equipmentId: parsed.equipmentId,
          officeId: parsed.officeId,
          departmentId: parsed.departmentId
        }
      });

      if (parsed.type === "Borrow") {
        await tx.equipment.update({
          where: { id: parsed.equipmentId },
          data: { status: "Borrowed", assignedTo: parsed.borrowerName ?? null }
        });
      } else if (parsed.type === "Return") {
        await tx.equipment.update({
          where: { id: parsed.equipmentId },
          data: { status: "Available", assignedTo: null }
        });
      }

      await tx.auditLog.create({
        data: { entityType: "Transaction", entityId: row.id, action: parsed.type.toUpperCase(), description: `Saved ${transactionId}` }
      });

      return row;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to save transaction." }, { status: 400 });
  }
}
