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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-gray-500 mt-1">Manage your pet profiles</p>
        </div>
        <Link
          href="/dashboard/client/pets/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Add Pet
        </Link>
      </div>

      {user.pets.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
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
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">
                  {pet.species === "Dog"
                    ? "🐕"
                    : pet.species === "Cat"
                      ? "🐈"
                      : "🐾"}
                </span>
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                {pet.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{pet.species}</p>
              {pet.breed && (
                <p className="text-gray-400 text-sm">{pet.breed}</p>
              )}
              {pet.age && (
                <p className="text-gray-400 text-sm">{pet.age} years old</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
