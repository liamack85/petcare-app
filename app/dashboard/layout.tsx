import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="ml-64">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Welcome back,{" "}
            <span className="text-gray-700 font-medium">
              {user.name || user.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
