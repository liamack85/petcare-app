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

  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet || pet.ownerId !== userId) redirect("/dashboard/client/pets");

  return (
    <main className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/client/pets"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to My Pets
        </Link>
        <h1 className="text-3xl font-bold mt-4">{pet.name}</h1>
        <p className="text-gray-500">{pet.species}</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Breed
            </p>
            <p className="font-medium">{pet.breed || "Not specified"}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Age
            </p>
            <p className="font-medium">
              {pet.age ? `${pet.age} years old` : "Not specified"}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Vet Name
            </p>
            <p className="font-medium">{pet.vetName || "Not specified"}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Vet Phone
            </p>
            <p className="font-medium">{pet.vetPhone || "Not specified"}</p>
          </div>
        </div>

        {pet.medication && (
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Medications
            </p>
            <p className="font-medium">{pet.medication}</p>
          </div>
        )}

        {pet.notes && (
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Notes
            </p>
            <p className="font-medium">{pet.notes}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Link
            href={`/dashboard/client/pets/${pet.id}/edit`}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 text-sm"
          >
            Edit Pet
          </Link>
        </div>
      </div>
    </main>
  );
}
