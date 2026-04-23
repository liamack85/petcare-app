import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewPetPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  async function createPet(formData: FormData) {
    "use server";

    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await prisma.pet.create({
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
        ownerId: userId,
      },
    });

    redirect("/dashboard/client/pets");
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/client/pets"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to My Pets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Add a Pet</h1>
        <p className="text-gray-500 mt-1">Fill in your pet&apos;s details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form action={createPet} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. Buddy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Species <span className="text-red-500">*</span>
              </label>
              <select
                name="species"
                required
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. Golden Retriever"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vet Name
              </label>
              <input
                name="vetName"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vet Phone
              </label>
              <input
                name="vetPhone"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g. 555-1234"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications
            </label>
            <input
              name="medication"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Apoquel 16mg daily"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Nervous around other dogs, loves belly rubs"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Save Pet
            </button>
            <Link
              href="/dashboard/client/pets"
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
