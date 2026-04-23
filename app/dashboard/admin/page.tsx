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

  const totalClients = await prisma.user.count({
    where: { role: "CLIENT" },
  });

  const totalEmployees = await prisma.user.count({
    where: { role: "EMPLOYEE" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your business
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {totalClients}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {totalEmployees}
          </p>
        </div>
      </div>

      {/* Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/admin/appointments"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">📅</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Appointments
          </h2>
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
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">🗓️</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Calendar</h2>
          <p className="text-gray-500 text-sm mt-1">View all appointments</p>
        </Link>
        <Link
          href="/dashboard/admin/employees"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">👥</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Employees</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your team
          </p>
        </Link>
        <Link
          href="/dashboard/admin/clients"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">🐶</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Clients</h2>
          <p className="text-gray-500 text-sm mt-1">
            View all clients and their pets
          </p>
        </Link>
      </div>
    </div>
  );
}
