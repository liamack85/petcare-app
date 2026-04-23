import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function ClientReportsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Visit Reports</h1>
        <p className="text-gray-500 mt-1">See reports and photos from visits</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
          <p className="text-gray-500 text-lg">No visit reports yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Reports will appear here after each visit
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <span className="text-sm">
                          {report.appointment.pet.species === "Dog"
                            ? "🐕"
                            : report.appointment.pet.species === "Cat"
                              ? "🐈"
                              : "🐾"}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {report.appointment.pet.name}
                      </h2>
                    </div>
                    <p className="text-gray-500 text-sm">
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
                    <p className="text-gray-400 text-sm mt-1">
                      Cared for by{" "}
                      {report.employee.name || report.employee.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {report.appointment.services.map((service) => (
                      <span
                        key={service.id}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {service.serviceType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">{report.notes}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-gray-900">
                      {report.duration ? `${report.duration} mins` : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Feeding
                    </p>
                    <p className="font-medium text-gray-900">
                      {report.feedingDone ? "✅ Done" : "❌ Not done"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Water
                    </p>
                    <p className="font-medium text-gray-900">
                      {report.waterDone ? "✅ Done" : "❌ Not done"}
                    </p>
                  </div>
                </div>
              </div>

              {report.photos.length > 0 && (
                <div className="border-t border-gray-100 p-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Photos ({report.photos.length})
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {report.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Visit photo"
                        className="max-h-48 w-auto rounded-lg object-contain"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
