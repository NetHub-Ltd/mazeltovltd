
"use client";
import {
  Home,
  CreditCard,
  Gift,
  Activity,
  MessageCircle,
  Users, // Added for Users Management
  LogOut, // For a potential logout button
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Define the shape of a link for better type safety
interface NavLink {
  name: string;
  icon: React.ReactNode;
  href: string;
  roles: string[]; // Not currently used for filtering, but good to have
}

const links: NavLink[] = [
  {
    name: "Home",
    icon: <Home size={20} />,
    href: "/dashboard",
    roles: ["Admin", "Client"],
  },
  {
    name: "Bingwa Offers", // Renamed from "Bingwa" for broader understanding
    icon: <Gift size={20} />, // Changed icon to better reflect "Offers"
    href: "/dashboard/bingwa", // Updated href to match new name
    roles: ["Admin", "Client"],
  },
  {
    name: "Transactions", // More descriptive
    icon: <Activity size={20} />, // Changed icon
    href: "/dashboard/transactions",
    roles: ["Admin", "Client"],
  },
  {
    name: "SMS Campaigns",
    icon: <MessageCircle size={20} />, // Changed icon
    href: "/dashboard/sms-campaigns",
    roles: ["Admin", "Client"],
  },
  {
    name: "Contacts",
    icon: <Users size={20} />, // Better icon for contacts
    href: "/dashboard/contacts-management",
    roles: ["Admin", "Client"],
  },
  {
    name: "Loyalty Program",
    icon: <CreditCard size={20} />, // Better icon for loyalty
    href: "/dashboard/loyalty-program",
    roles: ["Admin", "Client"],
  },

];

const SideNav = () => {
  const pathname = usePathname();

  const currentUserRole = "Admin"; // Example: Replace with actual user role

  const filteredLinks = links.filter((link) =>
    link.roles.includes(currentUserRole)
  );

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      <nav className="flex flex-col gap-1 py-4 overflow-y-auto flex-grow px-2">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex items-center gap-4 px-4 py-2 rounded-lg text-base font-medium
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex-shrink-0">{link.icon}</span>{" "}
              {/* Ensures icon doesn't shrink */}
              <span className="truncate">{link.name}</span>{" "}
              {/* Ensures text truncates if too long */}
            </Link>
          );
        })}
      </nav>

      {/* Optional: User/Account Section or Logout */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          <LogOut size={20} />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;