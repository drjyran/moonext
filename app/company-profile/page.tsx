import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BadgeCheck, Building2, Landmark, Scale, Users } from "lucide-react";
import { SectionHeading } from "@/components/public/section-heading";
import { auditedFinancialDetail, auditedFinancialSummary } from "@/lib/company-content";

export const metadata: Metadata = {
  title: "Company Profile",
  description: "MOONEXT CONSTRUCTIONS PRIVATE LIMITED legal identity and audited financial summary."
};

export default async function CompanyProfilePage() {
  return (
    <main className="bg-white">
      <section className="public-section bg-slate-950 text-white">
        <div className="public-container grid gap-8 lg:grid-cols-2">
          <SectionHeading eyebrow="Company Profile" title="MOONEXT CONSTRUCTIONS PRIVATE LIMITED" description="Legal identity aur audited financial track record." invert />
          <div className="rounded-[28px] border border-amber-200/30 bg-amber-50/10 p-6">
            <div className="flex items-center gap-3"><AlertTriangle size={20} className="text-amber-200" /><p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">Verification</p></div>
            <p className="mt-4 text-sm leading-7 text-slate-100">Legal name documents me MOONEXT CONSTRUCTIONS PRIVATE LIMITED hai. Website legal details se pehle verify karein.</p>
          </div>
        </div>
      </section>
      <section className="public-section">
        <div className="public-container grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 p-5 text-sm leading-6">Legal: MOONEXT CONSTRUCTIONS PRIVATE LIMITED<br />CIN: U45209BR2020PTC046852</div>
          <div className="rounded-[24px] border border-slate-200 p-5 text-sm leading-6">Regd. Office: Asgari Bhuneshwar Chowk, RNG B. Complex, Ramnagar, West Champaran, Bihar – 845106</div>
          <div className="rounded-[24px] border border-slate-200 p-5 text-sm leading-6">Auditor: Murmuria & Associates, Chartered Accountants, Kolkata. No qualification / reservation / adverse remark.</div>
        </div>
      </section>
      <section className="public-section">
        <div className="public-container">
          <SectionHeading eyebrow="Financials" title="Audited summary" description={auditedFinancialDetail.positioningLine} align="center" />
          <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead><tr className="bg-slate-950 text-white"><th className="px-6 py-4">FY</th><th className="px-6 py-4">Revenue</th><th className="px-6 py-4">PBT</th><th className="px-6 py-4">PAT</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {auditedFinancialSummary.map((r) => (<tr key={r.fy}><td className="px-6 py-4 font-semibold">{r.fy}</td><td className="px-6 py-4">{r.revenue}</td><td className="px-6 py-4">{r.pbt}</td><td className="px-6 py-4">{r.pat}</td></tr>))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-amber-800">{auditedFinancialDetail.cautionLine}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 p-5 text-sm leading-7">FY24-25 revenue from operations: Rs.21,97,765.05<br />PAT: Rs.77,450.16<br />Share capital: Rs.1,00,000<br />Reserves: Rs.2,98,690.05</div>
            <div className="rounded-[24px] border border-slate-200 p-5 text-sm leading-7">FY24-25 shareholding: Vijay Kumar 5000 shares 50 percent. Vinay Kumar 5000 shares 50 percent. Founder CEO MD titles assume nahi kiye gaye.</div>
          </div>
          <div className="mt-8 rounded-[28px] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">Abhi project portfolio kyon nahi</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">Audited financial statements se civil / mechanical project list nahi ban sakti. Project names, clients, locations, contract value, duration, scope, equipment, manpower, work orders aur completion certificates milne par hi portfolio add karein.</p>
          </div>
          <div className="mt-6 flex gap-3"><Link href="/contact" className="rounded-full bg-moonext-orange px-6 py-3 text-sm font-semibold text-white">Contact</Link><Building2 size={18} /><Landmark size={18} /><Scale size={18} /><Users size={18} /><BadgeCheck size={18} /></div>
        </div>
      </section>
    </main>
  );
}
