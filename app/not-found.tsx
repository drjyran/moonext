export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-moonext-navy">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The requested page does not exist.</p>
      </div>
    </main>
  );
}
