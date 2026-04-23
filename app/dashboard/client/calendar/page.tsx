import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default async function ClientCalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  const appointments = await prisma.appointment.findMany({
    where: { clientId: userId },
    include: { pet: true, services: true, employee: true },
  });

  const events = appointments.map((a) => ({
    id: a.id,
    title: `${a.pet.name} - ${a.services.map((s) => s.serviceType).join(", ")}`,
    start: new Date(a.date),
    end: new Date(new Date(a.date).getTime() + 60 * 60 * 1000),
    resource: {
      status: a.status,
      services: a.services.map((s) => s.serviceType),
      employee: a.employee?.name || a.employee?.email || null,
      pet: a.pet.name,
    },
  }));

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-gray-500 mt-1">View your upcoming appointments</p>
        </div>
        <Link
          href="/dashboard/client"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <div className="border rounded-lg p-4">
        <AppointmentCalendar events={events} />
      </div>
    </main>
  );
}
