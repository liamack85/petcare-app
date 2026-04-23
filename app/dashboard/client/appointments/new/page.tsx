import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewAppointmentPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pets: true },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");
  if (user.pets.length === 0) redirect("/dashboard/client/pets/new");

  async function createAppointment(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const services = formData.getAll("services") as string[];

    await prisma.appointment.create({
      data: {
        date: new Date(formData.get("date") as string),
        notes: (formData.get("notes") as string) || null,
        clientId: userId,
        petId: formData.get("petId") as string,
        services: {
          create: services.map((service) => ({
            serviceType: service as import("@prisma/client").ServiceType,
          })),
        },
      },
    });

    redirect("/dashboard/client/appointments");
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/client/appointments"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to Appointments
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Request Appointment
        </h1>
        <p className="text-gray-500 mt-1">
          Fill in the details for your appointment
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form action={createAppointment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pet <span className="text-red-500">*</span>
            </label>
            <select
              name="petId"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a pet</option>
              {user.pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              name="date"
              type="datetime-local"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {["WALK", "SITTING", "FEEDING", "GROOMING", "MEDICATION"].map(
                (service) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {service.charAt(0) + service.slice(1).toLowerCase()}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Any special instructions or notes for this appointment"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Request Appointment
            </button>
            <Link
              href="/dashboard/client/appointments"
              className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-600 flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
