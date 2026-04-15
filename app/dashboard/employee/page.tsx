import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function EmployeeDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "EMPLOYEE") redirect("/dashboard");

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
      <p className="text-gray-500">Welcome back, {user.name}!</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">My Schedule</h2>
          <p className="text-gray-500 text-sm mt-1">
            View your upcoming appointments
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold">Visit Reports</h2>
          <p className="text-gray-500 text-sm mt-1">
            Submit reports and photos
          </p>
        </div>
      </div>
    </main>
  );
}
