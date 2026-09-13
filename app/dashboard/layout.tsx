import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.05),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] md:flex">
        <Sidebar />
        <section className="min-w-0 flex-1">
          <Topbar />
          <main className="mx-auto w-full max-w-7xl p-4 pb-10 md:p-6">{children}</main>
        </section>
      </div>
    </ToastProvider>
  );
}
