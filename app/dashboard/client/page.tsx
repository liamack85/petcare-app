import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your account
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/client/pets"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">🐾</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">My Pets</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your pet profiles</p>
        </Link>
        <Link
          href="/dashboard/client/appointments"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">📅</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Appointments
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            View and request appointments
          </p>
        </Link>
        <Link
          href="/dashboard/client/reports"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">📋</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Visit Reports
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            See reports and photos from visits
          </p>
        </Link>
        <Link
          href="/dashboard/client/calendar"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <span className="text-xl">🗓️</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900">Calendar</h2>
          <p className="text-gray-500 text-sm mt-1">
            View your upcoming appointments
          </p>
        </Link>
      </div>
    </div>
  );
}
