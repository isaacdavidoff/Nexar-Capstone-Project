import ProtectedRoute from "@/components/protectedRoute";
import Header from "@/components/header";
import BottomNav from "@/components/bottomNav";

export default function AuthenticatedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
    
        <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}