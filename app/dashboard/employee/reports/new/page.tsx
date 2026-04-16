import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import VisitReportForm from "@/components/VisitReportForm";

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<{ appointmentId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "EMPLOYEE") redirect("/dashboard");

  const { appointmentId } = await searchParams;

  if (!appointmentId) redirect("/dashboard/employee");

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { pet: true, client: true, services: true },
  });

  if (!appointment || appointment.employeeId !== userId) {
    redirect("/dashboard/employee");
  }

  return (
    <main className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/employee"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-4">File Visit Report</h1>
        <p className="text-gray-500 mt-1">
          {appointment.pet.name} —{" "}
          {new Date(appointment.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <VisitReportForm appointmentId={appointmentId} employeeId={userId} />
    </main>
  );
}
