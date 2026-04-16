import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { appointmentId, notes, feedingDone, waterDone, duration, photos } =
    body;

  const report = await prisma.visitReport.create({
    data: {
      appointmentId,
      employeeId: userId,
      notes,
      feedingDone,
      waterDone,
      duration,
      photos: {
        create: photos.map((url: string) => ({ url })),
      },
    },
  });

  return NextResponse.json(report);
}
