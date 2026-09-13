import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-slate-50">
      <section className="public-section">
        <div className="public-container">
          <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-moonext-orange">404 Error</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Page not found.</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The requested page does not exist or may have moved. You can return to the Moonext homepage or continue to the services page.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-moonext-orange px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Go Home
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
