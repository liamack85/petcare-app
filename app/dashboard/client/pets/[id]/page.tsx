import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet || pet.ownerId !== userId) redirect("/dashboard/client/pets");

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/client/pets"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to My Pets
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">
              {pet.species === "Dog"
                ? "🐕"
                : pet.species === "Cat"
                  ? "🐈"
                  : "🐾"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
            <p className="text-gray-500">{pet.species}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Breed
            </p>
            <p className="font-medium text-gray-900">
              {pet.breed || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Age
            </p>
            <p className="font-medium text-gray-900">
              {pet.age ? `${pet.age} years old` : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Vet Name
            </p>
            <p className="font-medium text-gray-900">
              {pet.vetName || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Vet Phone
            </p>
            <p className="font-medium text-gray-900">
              {pet.vetPhone || "Not specified"}
            </p>
          </div>
        </div>

        {pet.medication && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Medications
            </p>
            <p className="font-medium text-gray-900">{pet.medication}</p>
          </div>
        )}

        {pet.notes && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="font-medium text-gray-900">{pet.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <Link
            href={`/dashboard/client/pets/${pet.id}/edit`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium inline-block"
          >
            Edit Pet
          </Link>
        </div>
      </div>
    </div>
  );
}
