"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VisitReportForm({
  appointmentId,
  employeeId,
}: {
  appointmentId: string;
  employeeId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        uploaded.push(data.secure_url);
      }
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId,
        employeeId,
        notes: formData.get("notes"),
        feedingDone: formData.get("feedingDone") === "on",
        waterDone: formData.get("waterDone") === "on",
        duration: formData.get("duration")
          ? parseInt(formData.get("duration") as string)
          : null,
        photos,
      }),
    });

    if (res.ok) {
      router.push("/dashboard/employee");
    } else {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Visit Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          name="notes"
          required
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="How did the visit go? Any observations about the pet's behavior, health, or mood?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Duration (minutes)
        </label>
        <input
          name="duration"
          type="number"
          min="1"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="e.g. 30"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Checklist</label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="feedingDone" className="w-4 h-4" />
          <span className="text-sm">Feeding completed</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="waterDone" className="w-4 h-4" />
          <span className="text-sm">Fresh water provided</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Photos</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        {uploading && (
          <p className="text-gray-500 text-sm mt-2">Uploading photos...</p>
        )}
        {photos.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {photos.map((url, i) => (
              <div key={i} className="relative w-full h-24">
                <Image
                  src={url}
                  alt={`Upload ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 text-sm disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
