"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";

type Site = { id: string; name: string; state: string };
type Contractor = { id: string; name: string };

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function ReportsPage() {
  const { pushToast } = useToast();
  const now = new Date();
  const [sites, setSites] = useState<Site[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [siteId, setSiteId] = useState("");
  const [contractorId, setContractorId] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/sites"), fetch("/api/contractors")]).then(async ([s, c]) => {
      if (!s.ok) return pushToast(await getError(s), "error");
      if (!c.ok) return pushToast(await getError(c), "error");
      setSites(await s.json());
      setContractors(await c.json());
    });
  }, []);

  const reportUrl = useMemo(
    () => `/api/reports/payroll.csv?month=${month}&year=${year}${siteId ? `&siteId=${siteId}` : ""}${contractorId ? `&contractorId=${contractorId}` : ""}`,
    [month, year, siteId, contractorId]
  );

  function downloadReport() {
    const monthNumber = Number(month);
    const yearNumber = Number(year);
    if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return pushToast("Month must be between 1 and 12", "error");
    }
    if (!Number.isInteger(yearNumber) || yearNumber < 2020 || yearNumber > 2100) {
      return pushToast("Year must be between 2020 and 2100", "error");
    }
    pushToast("Generating CSV report");
    window.location.href = reportUrl;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reports</h2>
      <div className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-5">
        <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} />
        <Input type="number" min={2020} max={2100} value={year} onChange={(e) => setYear(e.target.value)} />
        <Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          <option value="">All Sites</option>
          {sites.map((site) => <option key={site.id} value={site.id}>{site.name} ({site.state})</option>)}
        </Select>
        <Select value={contractorId} onChange={(e) => setContractorId(e.target.value)}>
          <option value="">All Contractors</option>
          {contractors.map((contractor) => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
        </Select>
        <button onClick={downloadReport} className="rounded-lg bg-moonext-navy px-4 py-2 text-center text-sm font-medium text-white">
          Download CSV
        </button>
      </div>
    </div>
  );
}
