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
    <main className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/client/appointments"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Appointments
        </Link>
        <h1 className="text-3xl font-bold mt-4">Request Appointment</h1>
        <p className="text-gray-500 mt-1">
          Fill in the details for your appointment
        </p>
      </div>

      <form action={createAppointment} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Pet <span className="text-red-500">*</span>
          </label>
          <select
            name="petId"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
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
          <label className="block text-sm font-medium mb-1">
            Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            name="date"
            type="datetime-local"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
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
                    className="w-4 h-4"
                  />
                  <span className="text-sm capitalize">
                    {service.charAt(0) + service.slice(1).toLowerCase()}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Any special instructions or notes for this appointment"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 text-sm"
          >
            Request Appointment
          </button>
          <Link
            href="/dashboard/client/appointments"
            className="px-6 py-2 rounded-lg border hover:bg-gray-50 text-sm flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
