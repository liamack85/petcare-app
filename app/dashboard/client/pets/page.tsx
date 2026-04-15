import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PetsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pets: true },
  });

  if (!user || user.role !== "CLIENT") redirect("/dashboard");

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Pets</h1>
          <p className="text-gray-500 mt-1">Manage your pet profiles</p>
        </div>
        <Link
          href="/dashboard/client/pets/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Add Pet
        </Link>
      </div>

      {user.pets.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-gray-500 text-lg">No pets added yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click &quot;Add Pet&quot; to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/dashboard/client/pets/${pet.id}`}
              className="p-6 border rounded-lg hover:border-gray-400 transition-colors"
            >
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p className="text-gray-500 mt-1">{pet.species}</p>
              {pet.breed && (
                <p className="text-gray-400 text-sm mt-1">{pet.breed}</p>
              )}
              {pet.age && (
                <p className="text-gray-400 text-sm">{pet.age} years old</p>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard/client"
          className="text-gray-500 hover:text-black text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
