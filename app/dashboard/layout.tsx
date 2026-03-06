import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen md:flex">
        <Sidebar />
        <section className="flex-1">
          <Topbar />
          <main className="p-4 md:p-6">{children}</main>
        </section>
      </div>
    </ToastProvider>
  );
}
