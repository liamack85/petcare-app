import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet || pet.ownerId !== userId) redirect("/dashboard/client/pets");

  async function updatePet(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await prisma.pet.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        species: formData.get("species") as string,
        breed: (formData.get("breed") as string) || null,
        age: formData.get("age")
          ? parseInt(formData.get("age") as string)
          : null,
        notes: (formData.get("notes") as string) || null,
        vetName: (formData.get("vetName") as string) || null,
        vetPhone: (formData.get("vetPhone") as string) || null,
        medication: (formData.get("medication") as string) || null,
      },
    });

    redirect(`/dashboard/client/pets/${id}`);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href={`/dashboard/client/pets/${pet.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to {pet.name}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Edit {pet.name}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form action={updatePet} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                defaultValue={pet.name}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Species <span className="text-red-500">*</span>
              </label>
              <select
                name="species"
                required
                defaultValue={pet.species}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <input
                name="breed"
                defaultValue={pet.breed ?? ""}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (years)
              </label>
              <input
                name="age"
                type="number"
                min="0"
                max="30"
                defaultValue={pet.age ?? ""}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vet Name
              </label>
              <input
                name="vetName"
                defaultValue={pet.vetName ?? ""}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vet Phone
              </label>
              <input
                name="vetPhone"
                defaultValue={pet.vetPhone ?? ""}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications
            </label>
            <input
              name="medication"
              defaultValue={pet.medication ?? ""}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={pet.notes ?? ""}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
            <Link
              href={`/dashboard/client/pets/${pet.id}`}
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
