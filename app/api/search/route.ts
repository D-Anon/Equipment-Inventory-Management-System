import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json([]);

  const rows = await prisma.equipment.findMany({
    where: {
      OR: [
        { assetId: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { serialNumber: { contains: q, mode: "insensitive" } },
        { assignedTo: { contains: q, mode: "insensitive" } },
        { office: { name: { contains: q, mode: "insensitive" } } }
      ]
    },
    include: { office: true },
    take: 50
  });

  return NextResponse.json(rows);
}
