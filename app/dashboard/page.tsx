import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user.role === "EMPLOYEE") {
    redirect("/dashboard/employee");
  }

  redirect("/dashboard/client");
}
