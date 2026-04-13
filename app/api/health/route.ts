import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "Database connected successfully" });
  } catch (error) {
    return NextResponse.json(
      { status: "Database connection failed", error },
      { status: 500 },
    );
  }
}
