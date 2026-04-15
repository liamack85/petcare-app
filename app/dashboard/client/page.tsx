import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ClientDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Client Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}!</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">My Pets</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your pet profiles</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and request appointments
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Visit Reports</h2>
          <p className="text-gray-500 text-sm mt-1">
            See reports and photos from visits
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Messages</h2>
          <p className="text-gray-500 text-sm mt-1">
            Communicate with your care team
          </p>
        </div>
      </div>
    </main>
  );
}
