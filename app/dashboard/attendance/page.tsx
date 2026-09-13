"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";

type Site = { id: string; name: string };
type Labour = { id: string; fullName: string; assignedSite: { id: string; name: string } };
type ShiftType = "FULL_TIME" | "HALF_TIME" | "OVER_TIME" | "ABSENT";

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function AttendancePage() {
  const { pushToast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [siteId, setSiteId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [shiftMap, setShiftMap] = useState<Record<string, ShiftType>>({});
  const [overtimeMap, setOvertimeMap] = useState<Record<string, string>>({});
  const [descriptionMap, setDescriptionMap] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function load() {
    const [s, l] = await Promise.all([fetch("/api/sites"), fetch("/api/labours")]);
    if (!s.ok) return pushToast(await getError(s), "error");
    if (!l.ok) return pushToast(await getError(l), "error");

    const siteData = await s.json();
    setSites(siteData);
    if (siteData.length && !siteId) setSiteId(siteData[0].id);
    setLabours(await l.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => labours.filter((labour) => labour.assignedSite?.id === siteId), [labours, siteId]);

  async function saveAttendance() {
    if (!siteId) return pushToast("Please select a site", "error");

    setSaving(true);
    const records = filtered.map((labour) => {
      const shiftType = (shiftMap[labour.id] || "FULL_TIME") as ShiftType;
      return {
        labourId: labour.id,
        shiftType,
        overtimeHours: shiftType === "OVER_TIME" ? Number(overtimeMap[labour.id] || "2") : 0,
        workDescription: descriptionMap[labour.id] || ""
      };
    });

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, date, records })
    });

    setSaving(false);
    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast("Attendance & work descriptions saved");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Daily Attendance & Work Log</h2>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-3">
        <Select value={siteId} onChange={(e) => setSiteId(e.target.value)}>
          {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={saveAttendance} disabled={saving} className="w-full xl:w-auto">{saving ? "Saving..." : "Save Attendance"}</Button>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="table-base min-w-[860px]">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Worker</th>
              <th className="px-3 py-2">Shift</th>
              <th className="px-3 py-2">Overtime (hours)</th>
              <th className="px-3 py-2">Work Description (for selected date)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((labour) => {
              const shift = shiftMap[labour.id] || "FULL_TIME";
              return (
                <tr key={labour.id} className="border-t">
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{labour.fullName}</td>
                  <td className="px-3 py-2">
                    <Select
                      className="min-w-[180px]"
                      value={shift}
                      onChange={(e) => setShiftMap((prev) => ({ ...prev, [labour.id]: e.target.value as ShiftType }))}
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="HALF_TIME">Half Time</option>
                      <option value="OVER_TIME">Over Time</option>
                      <option value="ABSENT">Absent</option>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      className="min-w-[120px]"
                      type="number"
                      min={0}
                      max={24}
                      disabled={shift !== "OVER_TIME"}
                      value={overtimeMap[labour.id] || "2"}
                      onChange={(e) => setOvertimeMap((prev) => ({ ...prev, [labour.id]: e.target.value }))}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      className="min-w-[260px]"
                      placeholder="e.g. brickwork, wiring, plastering..."
                      value={descriptionMap[labour.id] || ""}
                      onChange={(e) => setDescriptionMap((prev) => ({ ...prev, [labour.id]: e.target.value }))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
