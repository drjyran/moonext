"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";

type Site = { id: string; name: string; city: string };
type Material = {
  id: string;
  name: string;
  quantity: number;
  consumedQty: number;
  unit: string;
  supplier?: string;
  purchaseDate: string;
  site: Site;
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function MaterialsPage() {
  const { pushToast } = useToast();
  const [rows, setRows] = useState<Material[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    siteId: "",
    supplier: "",
    purchaseDate: new Date().toISOString().slice(0, 10)
  });

  async function load() {
    const [materialsRes, sitesRes] = await Promise.all([fetch("/api/materials"), fetch("/api/sites")]);
    if (!materialsRes.ok) return pushToast(await getError(materialsRes), "error");
    if (!sitesRes.ok) return pushToast(await getError(sitesRes), "error");
    setRows(await materialsRes.json());
    setSites(await sitesRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createMaterial() {
    if (!form.name || !form.quantity || !form.siteId) {
      pushToast("Name, quantity and site are required", "error");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) })
    });
    setLoading(false);

    if (!res.ok) return pushToast(await getError(res), "error");

    pushToast("Material added");
    setForm({
      name: "",
      quantity: "",
      unit: "kg",
      siteId: "",
      supplier: "",
      purchaseDate: new Date().toISOString().slice(0, 10)
    });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Material Management</h2>

      <div className="rounded-xl border bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Material Name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cement" />
          </FormField>
          <FormField label="Quantity" required>
            <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="250" />
          </FormField>
          <FormField label="Unit">
            <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              <option value="kg">kg</option>
              <option value="bag">bag</option>
              <option value="ton">ton</option>
              <option value="pcs">pcs</option>
            </Select>
          </FormField>
          <FormField label="Site" required>
            <Select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}>
              <option value="">Select site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>{site.name} ({site.city})</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Supplier">
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="ABC Suppliers" />
          </FormField>
          <FormField label="Purchase Date">
            <Input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
          </FormField>
        </div>
        <div className="mt-3">
          <Button onClick={createMaterial} disabled={loading}>{loading ? "Saving..." : "Add Material"}</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Material</th>
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Consumed</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.site?.name || "-"}</td>
                <td className="px-3 py-2">{Number(row.quantity)} {row.unit}</td>
                <td className="px-3 py-2">{Number(row.consumedQty)} {row.unit}</td>
                <td className="px-3 py-2">{row.supplier || "-"}</td>
                <td className="px-3 py-2">{new Date(row.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
