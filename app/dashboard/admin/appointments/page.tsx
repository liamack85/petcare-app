import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminAppointmentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const appointments = await prisma.appointment.findMany({
    include: {
      client: true,
      pet: true,
      services: true,
      employee: true,
    },
    orderBy: { date: "asc" },
  });

  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Appointments</h1>
          <p className="text-gray-500 mt-1">Manage and assign appointments</p>
        </div>
        <Link
          href="/dashboard/admin"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-gray-500 text-lg">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-6 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    {appointment.pet.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Client:{" "}
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
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
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
              </div>

              {appointment.status === "PENDING" && (
                <div className="mt-4 pt-4 border-t flex gap-4 items-center">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const employeeId = formData.get("employeeId") as string;
                      await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: {
                          status: "APPROVED",
                          employeeId: employeeId || null,
                        },
                      });
                      redirect("/dashboard/admin/appointments");
                    }}
                  >
                    <div className="flex gap-3 items-center">
                      <select
                        name="employeeId"
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Assign employee (optional)</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name || emp.email}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                    </div>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: { status: "REJECTED" },
                      });
                      redirect("/dashboard/admin/appointments");
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
