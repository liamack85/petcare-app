import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EmployeeDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "EMPLOYEE") redirect("/dashboard");

  const appointments = await prisma.appointment.findMany({
    where: { employeeId: userId, status: "APPROVED" },
    include: { pet: true, client: true, services: true, report: true },
    orderBy: { date: "asc" },
  });

  const today = new Date();
  const upcoming = appointments.filter((a) => new Date(a.date) >= today);
  const past = appointments.filter((a) => new Date(a.date) < today);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s your schedule for today and upcoming visits
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Appointments
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-10 bg-white border border-gray-100 rounded-xl">
            <p className="text-gray-500">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-6 rounded-xl border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm">
                          {appointment.pet.species === "Dog"
                            ? "🐕"
                            : appointment.pet.species === "Cat"
                              ? "🐈"
                              : "🐾"}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {appointment.pet.name}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Owner:{" "}
                      {appointment.client.name || appointment.client.email}
                    </p>
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
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {service.serviceType}
                        </span>
                      ))}
                    </div>
                    {appointment.notes && (
                      <p className="text-gray-400 text-sm mt-2">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div>
                    {appointment.report ? (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Report Filed
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/employee/reports/new?appointmentId=${appointment.id}`}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-700"
                      >
                        File Report
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Past Appointments
          </h2>
          <div className="space-y-4">
            {past.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-6 rounded-xl border border-gray-100 opacity-60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {appointment.pet.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(appointment.date).toLocaleDateString("en-US", {
                        weekday: "long",
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
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {service.serviceType}
                        </span>
                      ))}
                    </div>
                  </div>
                  {appointment.report ? (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Report Filed
                    </span>
                  ) : (
                    <Link
                      href={`/dashboard/employee/reports/new?appointmentId=${appointment.id}`}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium hover:bg-blue-700"
                    >
                      File Report
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
