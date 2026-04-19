"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthUser from "@/hooks/useAuth";
import Image from "next/image";
import Logo from "@/assets/logonexar.png";

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
          <Image src={Logo} alt="Nexar Logo" width={100} height={24} className="hidden sm:block w-8 h-8" />
          <h2 className="font-semibold text-2xl text--500" >Nexar</h2>
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