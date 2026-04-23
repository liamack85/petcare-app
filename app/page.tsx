import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900">PawCare</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <span>🐾</span>
          <span>Professional Pet Care Management</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Pet care your clients
          <span className="text-blue-600"> will love</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          PawCare helps pet care businesses manage appointments, coordinate
          employees, and keep clients informed with visit reports and photos
          after every visit.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 text-lg"
          >
            Get started free
          </Link>
          <Link
            href="/sign-in"
            className="text-gray-600 hover:text-gray-900 px-8 py-3 rounded-lg font-medium text-lg border border-gray-200 hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything your pet care business needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Smart Scheduling
              </h3>
              <p className="text-gray-500 text-sm">
                Clients request appointments online. Admins approve and assign
                employees in one click.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📋</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Visit Reports
              </h3>
              <p className="text-gray-500 text-sm">
                Employees file detailed reports after each visit including
                photos, feeding notes, and observations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🐾</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pet Profiles</h3>
              <p className="text-gray-500 text-sm">
                Store vet info, medications, and care notes for every pet so
                your team is always prepared.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🗓️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Calendar View
              </h3>
              <p className="text-gray-500 text-sm">
                Everyone gets a role-specific calendar. Clients see their
                appointments, employees see their schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Role Based Access
              </h3>
              <p className="text-gray-500 text-sm">
                Admins, employees, and clients each see exactly what they need —
                nothing more, nothing less.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📸</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Photo Updates
              </h3>
              <p className="text-gray-500 text-sm">
                Clients receive photo updates after every visit so they always
                know their pet is happy and safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-500 mb-8">
            Join pet care businesses already using PawCare to delight their
            clients and streamline their operations.
          </p>
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 text-lg inline-block"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 PawCare. Built with ❤️ for pet care professionals.
        </p>
      </footer>
    </main>
  );
}
