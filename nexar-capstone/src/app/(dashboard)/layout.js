import ProtectedRoute from "@/components/protectedRoute";
import Header from "@/components/header";
import BottomNav from "@/components/bottomNav";
import { TaskProvider } from "@/context/TaskContext";
import { NotificationProvider } from "@/context/Notification";

export default function AuthenticatedLayout({ children }) {
  return (
    <ProtectedRoute>
      <NotificationProvider>
      <TaskProvider>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
    
        <main className="flex-1 pt-8 pb-24 px-4 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <BottomNav />
      </div>
      </TaskProvider>
      </NotificationProvider>
    </ProtectedRoute>
  );
}