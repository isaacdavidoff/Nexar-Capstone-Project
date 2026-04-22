"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthUser from "@/hooks/useAuth";
import Image from "next/image";
import Logo from "@/assets/logonexar.png";
import { useNexarNotifications } from "@/context/Notification";

export default function Header() {
  const pathname = usePathname();
  const user = useAuthUser();
  const { permission, requestPermission } = useNexarNotifications();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Courses", href: "/courses" },
    { name: "Focus", href: "/focus" },
    { name: "Reports", href: "/report" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  

  const isLoading = user === undefined;

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Nexar Logo" width={100} height={24} className="hidden sm:block w-8 h-8" />
          <h2 className="font-black text-2xl text-neutral-900 tracking-tighter" >Nexar</h2>
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

       {/* Notification Status Section */}
<div className="flex items-center gap-3">
  {permission !== "granted" ? (
    <button 
      onClick={requestPermission}
      className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
    >
      Enable Alerts 🔔
    </button>
  ) : (
    <div 
      title="Notifications Active"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-400 hover:text-indigo-600 transition-colors cursor-help"
    >
      <span className="text-xs">🔔</span>
    </div>
  )}


        <div className="flex items-center gap-3">
          <Link href="/useraccount">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-violet-600 flex items-center justify-center text-white text-sm font-semibold uppercase hover:bg-violet-700 transition cursor-pointer">
              
              {isLoading ? (
                "..."
              ) : user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0] || "U"
              )}

            </div>
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}