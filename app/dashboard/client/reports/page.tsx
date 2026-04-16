import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function ClientReportsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  const reports = await prisma.visitReport.findMany({
    where: {
      appointment: {
        clientId: userId,
      },
    },
    include: {
      appointment: {
        include: {
          pet: true,
          services: true,
        },
      },
      employee: true,
      photos: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Visit Reports</h1>
          <p className="text-gray-500 mt-1">
            See reports and photos from visits
          </p>
        </div>
        <Link
          href="/dashboard/client"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-gray-500 text-lg">No visit reports yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Reports will appear here after each visit
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <div key={report.id} className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {report.appointment.pet.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(report.appointment.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Cared for by{" "}
                      {report.employee.name || report.employee.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {report.appointment.services.map((service) => (
                      <span
                        key={service.id}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {service.serviceType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">{report.notes}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Duration
                    </p>
                    <p className="font-medium">
                      {report.duration ? `${report.duration} mins` : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Feeding
                    </p>
                    <p className="font-medium">
                      {report.feedingDone ? "✅ Done" : "❌ Not done"}
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Water
                    </p>
                    <p className="font-medium">
                      {report.waterDone ? "✅ Done" : "❌ Not done"}
                    </p>
                  </div>
                </div>
              </div>

              {report.photos.length > 0 && (
                <div className="border-t p-6">
                  <p className="text-sm font-medium mb-3">
                    Photos ({report.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {report.photos.map((photo) => (
                      <div key={photo.id} className="relative h-48">
                        <Image
                          src={photo.url}
                          alt="Visit photo"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
