import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}!</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/client/pets"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">My Pets</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your pet profiles</p>
        </Link>
        <Link
          href="/dashboard/client/appointments"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and request appointments
          </p>
        </Link>
        <Link
          href="/dashboard/client/reports"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Visit Reports</h2>
          <p className="text-gray-500 text-sm mt-1">
            See reports and photos from visits
          </p>
        </Link>
        <Link
          href="/dashboard/client/calendar"
          className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <h2 className="text-lg font-semibold">Calendar</h2>
          <p className="text-gray-500 text-sm mt-1">
            View your upcoming appointments
          </p>
        </Link>
      </div>
    </main>
  );
}
