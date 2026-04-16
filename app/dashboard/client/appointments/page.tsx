import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppointmentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  const appointments = await prisma.appointment.findMany({
    where: { clientId: userId },
    include: {
      pet: true,
      services: true,
      employee: true,
    },
    orderBy: { date: "asc" },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3x1 font-bold">Appointments</h1>
          <p className="text-gray-500 mt-1">View and request appointments</p>
        </div>
        <Link
          href="/dashboard/client/appointments/new"
          className="bg-black text-white px-4 py-2 rounded-1g hover:bg-gray-800 text-sm"
        >
          + Request Appointment
        </Link>
      </div>
      {appointments.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-gray-500 text-lg">No appointments yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click &quot;Request Appointment&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-6 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{appointment.pet.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="flex gap-2 mt-2">
                  {appointment.services.map((service) => (
                    <span
                      key={service.id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {service.serviceType}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    appointment.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {appointment.status}
                </span>
                {appointment.employee && (
                  <p className="text-gray-400 text-xs mt-2">
                    Assigned to {appointment.employee.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard/client"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
