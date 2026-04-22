"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: "🏠" },
    { name: "Courses", href: "/courses", icon: "📚" },
    { name: "Focus", href: "/focus", icon: "🎯" },
    { name: "Stats", href: "/report", icon: "📊" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-neutral-100 px-2 pt-2 pb-5"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full py-1 group"
            >
              {/* Active Highlight Glow */}
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 bg-violet-600 rounded-full animate-pulse" />
              )}
              
              <span className={`text-xl transition-transform ${isActive ? "scale-110" : "grayscale opacity-70"}`}>
                {item.icon}
              </span>
              
              <span className={`text-[10px] mt-1 transition-colors ${
                isActive
                  ? "text-violet-700 font-bold"
                  : "text-neutral-400 font-medium"
              }`}>
                {item.name}
              </span>

              {/* Tap Feedback Overlay */}
              <div className="absolute inset-0 bg-neutral-100/0 active:bg-neutral-100/50 rounded-xl transition-colors" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}