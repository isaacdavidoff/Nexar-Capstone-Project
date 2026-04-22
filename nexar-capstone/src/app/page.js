"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-indigo-100">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
            <img src ="/icon.png"/>
          </div>
          <span className="text-xl font-black tracking-tighter">Nexar</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition">
            Sign In
          </Link>
          <Link href="/register" className="bg-neutral-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition shadow-lg shadow-neutral-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="pt-20 pb-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
            The Ultimate Student OS
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            Focus deeper. <br />
            <span className="text-indigo-600">Finish faster.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto mb-10">
            Nexar combines high-precision focus sessions with smart academic tracking to help you own your semester without the burnout.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-neutral-900 text-white px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-xl active:scale-95">
              Build Your Catalog
            </Link>
            <Link href="#features" className="w-full sm:w-auto bg-white border-2 border-neutral-100 px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-neutral-50 transition">
              See How it Works
            </Link>
          </div>
        </motion.div>
      </header>

      {/* --- Feature Grid --- */}
      <section id="features" className="bg-neutral-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              emoji="🎯"
              title="Focus Mode"
              description="High-precision Pomodoro sessions tied directly to your course assignments."
            />
            <FeatureCard 
              emoji="📊"
              title="Workload Insights"
              description="Visualize your week and see which courses are demanding the most time."
            />
            <FeatureCard 
              emoji="📂"
              title="Course Registry"
              description="Keep your materials, deadlines, and grades organized in one unified hub."
            />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 px-6 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-neutral-400 text-sm font-bold uppercase tracking-widest">
            © 2026 Nexar Capstone Project
          </div>
          <div className="flex gap-8 text-sm font-bold text-neutral-500">
            <a href="#" className="hover:text-indigo-600 transition">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ emoji, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="text-4xl mb-6">{emoji}</div>
      <h3 className="text-xl font-black text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-500 font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}