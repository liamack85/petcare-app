import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const pendingCount = await prisma.appointment.count({
    where: { status: "PENDING" },
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}!</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/appointments"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and assign appointments
          </p>
          {pendingCount > 0 && (
            <p className="text-yellow-600 text-sm font-medium mt-2">
              {pendingCount} pending request{pendingCount > 1 ? "s" : ""}
            </p>
          )}
        </Link>
        <Link
          href="/dashboard/admin/calendar"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Calendar</h2>
          <p className="text-gray-500 text-sm mt-1">View all appointments</p>
        </Link>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Employees</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your team
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Clients</h2>
          <p className="text-gray-500 text-sm mt-1">
            View all clients and their pets
          </p>
        </div>
      </div>
    </main>
  );
}
