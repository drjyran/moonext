import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { FloatingOrbs } from "@/components/public/floating-orbs";
import { Reveal } from "@/components/public/reveal";
import { SectionHeading } from "@/components/public/section-heading";
import { auditedFinancialDetail, auditedFinancialSummary } from "@/lib/company-content";

export const metadata: Metadata = {
  title: "Company Profile",
  description: "MOONEXT CONSTRUCTIONS PRIVATE LIMITED legal identity and audited financial summary."
};

export default async function CompanyProfilePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0b1026_0%,#2e1065_45%,#7c3aed_75%,#be185d_100%)] text-white">
        <FloatingOrbs count={5} />
        <div className="public-container grid gap-8 lg:grid-cols-2">
          <SectionHeading eyebrow="Company Profile" title="MOONEXT CONSTRUCTIONS PRIVATE LIMITED" description="Legal identity aur audited financial track record." invert />
          <div className="rounded-[28px] border border-amber-300/40 bg-white/10 p-6 shadow-[0_20px_55px_rgba(124,58,237,0.22)] backdrop-blur-md">
            <div className="flex items-center gap-3"><AlertTriangle size={20} className="text-amber-200" /><p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Verification</p></div>
            <p className="mt-4 text-sm leading-7 text-slate-100">Legal name documents me MOONEXT CONSTRUCTIONS PRIVATE LIMITED hai. Website legal details se pehle verify karein.</p>
          </div>
        </div>
      </section>
      <section className="public-section bg-[linear-gradient(180deg,#fdf2f8_0%,#f5f3ff_100%)]">
        <div className="public-container grid gap-6 md:grid-cols-3">
          <Reveal delay={1}><div className="lively-card rounded-[24px] border border-violet-200/60 bg-white p-5 text-sm leading-6 shadow-[0_12px_30px_rgba(124,58,237,0.10)]">Legal: MOONEXT CONSTRUCTIONS PRIVATE LIMITED<br />CIN: U45209BR2020PTC046852</div></Reveal>
          <Reveal delay={2}><div className="lively-card rounded-[24px] border border-sky-200/60 bg-white p-5 text-sm leading-6 shadow-[0_12px_30px_rgba(14,165,233,0.10)]">Regd. Office: Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106</div></Reveal>
          <Reveal delay={3}><div className="lively-card rounded-[24px] border border-emerald-200/60 bg-white p-5 text-sm leading-6 shadow-[0_12px_30px_rgba(16,185,129,0.10)]">Auditor: Murmuria & Associates, Chartered Accountants, Kolkata. No qualification / reservation / adverse remark.</div></Reveal>
        </div>
      </section>
      <section className="public-section bg-[linear-gradient(180deg,#fef3c7_0%,#ecfdf5_100%)]">
        <div className="public-container">
          <SectionHeading eyebrow="Financials" title="Audited summary" description={auditedFinancialDetail.positioningLine} tone="emerald" align="center" />
          <Reveal>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-emerald-200/60 bg-white shadow-[0_20px_55px_rgba(16,185,129,0.12)]">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead><tr className="bg-[linear-gradient(135deg,#065f46_0%,#10b981_55%,#14b8a6_100%)] text-white"><th className="px-6 py-4">FY</th><th className="px-6 py-4">Revenue</th><th className="px-6 py-4">PBT</th><th className="px-6 py-4">PAT</th></tr></thead>
              <tbody className="divide-y divide-emerald-100">
                {auditedFinancialSummary.map((r) => (<tr key={r.fy} className="transition duration-200 hover:bg-emerald-50"><td className="px-6 py-4 font-semibold">{r.fy}</td><td className="px-6 py-4">{r.revenue}</td><td className="px-6 py-4">{r.pbt}</td><td className="px-6 py-4">{r.pat}</td></tr>))}
              </tbody>
            </table>
          </div>
          </Reveal>
          <p className="mt-4 text-sm text-amber-800">{auditedFinancialDetail.cautionLine}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal delay={1}><div className="lively-card rounded-[24px] border border-violet-200/60 p-5 text-sm leading-7">FY24-25 revenue from operations: Rs.21,97,765.05<br />PAT: Rs.77,450.16<br />Share capital: Rs.1,00,000<br />Reserves: Rs.2,98,690.05</div></Reveal>
            <Reveal delay={2}><div className="lively-card rounded-[24px] border border-sky-200/60 p-5 text-sm leading-7">FY24-25 shareholding: Vijay Kumar 5000 shares 50 percent. Vinay Kumar 5000 shares 50 percent. Founder CEO MD titles assume nahi kiye gaye.</div></Reveal>
          </div>
          <Reveal delay={3}>
          <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,#4c1d95_0%,#7c3aed_55%,#0ea5e9_100%)] p-6 text-white shadow-[0_20px_55px_rgba(124,58,237,0.26)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">Abhi project portfolio kyon nahi</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">Audited financial statements se civil / mechanical project list nahi ban sakti. Project names, clients, locations, contract value, duration, scope, equipment, manpower, work orders aur completion certificates milne par hi portfolio add karein.</p>
          </div>
          </Reveal>
          <Reveal delay={3}>
          <div className="mt-6 flex gap-3">
            <Link href="/contact" className="lively-button inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185_0%,#f59e0b_50%,#10b981_100%)] px-6 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(244,63,94,0.26)]">Contact</Link>
            <Link href="/" className="lively-button inline-flex min-h-11 items-center justify-center rounded-full border border-violet-300 bg-white/90 px-6 text-sm font-semibold text-violet-700 shadow-[0_10px_25px_rgba(124,58,237,0.12)]">Back To Home</Link>
          </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
