"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthUser from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const user = useAuthUser();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Courses", href: "/courses" },
    { name: "Focus", href: "/focus" },
    { name: "Reports", href: "/reports" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isLoading = user === undefined;

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-violet-500 text-white">
            🎓
          </div>
          <h1 className="text-lg font-semibold">StudyFlow</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition ${
                isActive(item.href)
                  ? "text-violet-600"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
   
          <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-semibold uppercase">
            {isLoading
              ? "..."
              : user?.name?.[0] || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}