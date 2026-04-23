"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const clientNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/client", icon: "🏠" },
  { label: "My Pets", href: "/dashboard/client/pets", icon: "🐾" },
  { label: "Appointments", href: "/dashboard/client/appointments", icon: "📅" },
  { label: "Calendar", href: "/dashboard/client/calendar", icon: "🗓️" },
  { label: "Visit Reports", href: "/dashboard/client/reports", icon: "📋" },
];

const employeeNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/employee", icon: "🏠" },
  { label: "My Schedule", href: "/dashboard/employee/calendar", icon: "🗓️" },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "🏠" },
  { label: "Appointments", href: "/dashboard/admin/appointments", icon: "📅" },
  { label: "Calendar", href: "/dashboard/admin/calendar", icon: "🗓️" },
  { label: "Employees", href: "/dashboard/admin/employees", icon: "👥" },
  { label: "Clients", href: "/dashboard/admin/clients", icon: "🐶" },
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const nav =
    role === "ADMIN" ? adminNav : role === "EMPLOYEE" ? employeeNav : clientNav;
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Image
            src="/a-plus-pets-logo.webp"
            alt="A-Plus Pets"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-semibold text-gray-900">A-Plus Pets</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {role.toLowerCase()} account
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Button */}
      <div className="p-4 border-t border-gray-100 flex items-center gap-3">
        <UserButton />
        <span className="text-sm text-gray-500">Account</span>
      </div>
    </aside>
  );
}
