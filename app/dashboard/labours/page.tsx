"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast-provider";
import { formatCurrency } from "@/lib/utils";
import { isPositiveNumber, isValidAadhaar, isValidPhone } from "@/lib/validation";

type Site = { id: string; name: string };
type Contractor = { id: string; name: string };
type Labour = {
  id: string;
  fullName: string;
  phone: string;
  skillType: string;
  dailyWage: number;
  status: "ACTIVE" | "INACTIVE";
  assignedSite: Site;
  contractor: Contractor;
};

type LabourForm = {
  fullName: string;
  phone: string;
  aadhaarNumber: string;
  skillType: string;
  dailyWage: string;
  contractorId: string;
  assignedSiteId: string;
};

const defaultForm: LabourForm = {
  fullName: "",
  phone: "",
  aadhaarNumber: "",
  skillType: "Helper",
  dailyWage: "",
  contractorId: "",
  assignedSiteId: ""
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function LaboursPage() {
  const { pushToast } = useToast();
  const [labours, setLabours] = useState<Labour[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [form, setForm] = useState<LabourForm>(defaultForm);
  const [editLabour, setEditLabour] = useState<Labour | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", skillType: "", dailyWage: "" });
  const [deleteLabour, setDeleteLabour] = useState<Labour | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof LabourForm, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<"fullName" | "skillType" | "dailyWage", string>>>({});

  function validateCreate(value: LabourForm) {
    const next: Partial<Record<keyof LabourForm, string>> = {};
    if (!value.fullName.trim()) next.fullName = "Full name is required";
    if (!isValidPhone(value.phone)) next.phone = "Phone must be 10 digits";
    if (!isValidAadhaar(value.aadhaarNumber)) next.aadhaarNumber = "Aadhaar must be 12 digits";
    if (!value.skillType.trim()) next.skillType = "Skill is required";
    if (!isPositiveNumber(value.dailyWage)) next.dailyWage = "Daily wage must be greater than 0";
    if (!value.contractorId) next.contractorId = "Select contractor";
    if (!value.assignedSiteId) next.assignedSiteId = "Select site";
    return next;
  }

  function validateEdit(value: { fullName: string; skillType: string; dailyWage: string }) {
    const next: Partial<Record<"fullName" | "skillType" | "dailyWage", string>> = {};
    if (!value.fullName.trim()) next.fullName = "Full name is required";
    if (!value.skillType.trim()) next.skillType = "Skill is required";
    if (!isPositiveNumber(value.dailyWage)) next.dailyWage = "Daily wage must be greater than 0";
    return next;
  }

  async function load() {
    const [l, s, c] = await Promise.all([fetch("/api/labours"), fetch("/api/sites"), fetch("/api/contractors")]);
    if (!l.ok) return pushToast(await getError(l), "error");
    if (!s.ok) return pushToast(await getError(s), "error");
    if (!c.ok) return pushToast(await getError(c), "error");
    setLabours(await l.json());
    setSites(await s.json());
    setContractors(await c.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createLabour() {
    const nextErrors = validateCreate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("create");
    const res = await fetch("/api/labours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dailyWage: Number(form.dailyWage) })
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");

    setForm(defaultForm);
    setErrors({});
    pushToast("Labour added");
    load();
  }

  function openEdit(labour: Labour) {
    setEditLabour(labour);
    setEditForm({ fullName: labour.fullName, skillType: labour.skillType, dailyWage: String(labour.dailyWage) });
    setEditErrors({});
  }

  async function saveEdit() {
    if (!editLabour) return;
    const nextErrors = validateEdit(editForm);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction(`edit:${editLabour.id}`);
    const res = await fetch(`/api/labours/${editLabour.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, dailyWage: Number(editForm.dailyWage) })
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setEditLabour(null);
    pushToast("Labour updated");
    load();
  }

  async function toggleStatus(labour: Labour) {
    setLoadingAction(`toggle:${labour.id}`);
    const res = await fetch(`/api/labours/${labour.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: labour.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast("Labour status updated");
    load();
  }

  async function confirmDeleteLabour() {
    if (!deleteLabour) return;
    setLoadingAction(`delete:${deleteLabour.id}`);
    const res = await fetch(`/api/labours/${deleteLabour.id}`, { method: "DELETE" });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setDeleteLabour(null);
    pushToast("Labour deleted");
    load();
  }

  const createInvalid = Object.keys(validateCreate(form)).length > 0;
  const editInvalid = Object.keys(validateEdit(editForm)).length > 0;
  const hasRequiredMasters = sites.length > 0 && contractors.length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Labour Management</h2>
      {!hasRequiredMasters ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Add at least one Site and one Contractor first, then you can create labour records.
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Full Name" required error={errors.fullName}>
            <Input placeholder="Ramesh Patel" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Phone" required error={errors.phone} hint="10-digit mobile number">
            <Input placeholder="9012345671" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Aadhaar Number" required error={errors.aadhaarNumber} hint="12-digit Aadhaar number">
            <Input placeholder="111122223333" value={form.aadhaarNumber} onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })} />
          </FormField>
          <FormField label="Skill Type" required error={errors.skillType}>
            <Input placeholder="Mason / Helper / Electrician" value={form.skillType} onChange={(e) => setForm({ ...form, skillType: e.target.value })} />
          </FormField>
          <FormField label="Daily Wage (INR)" required error={errors.dailyWage}>
            <Input placeholder="800" type="number" value={form.dailyWage} onChange={(e) => setForm({ ...form, dailyWage: e.target.value })} />
          </FormField>
          <FormField label="Assigned Site" required error={errors.assignedSiteId}>
            <Select value={form.assignedSiteId} onChange={(e) => setForm({ ...form, assignedSiteId: e.target.value })}>
              <option value="">Select site</option>
              {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Contractor" required error={errors.contractorId}>
            <Select value={form.contractorId} onChange={(e) => setForm({ ...form, contractorId: e.target.value })}>
              <option value="">Select contractor</option>
              {contractors.map((contractor) => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="mt-3">
          <Button onClick={createLabour} disabled={loadingAction === "create" || createInvalid || !hasRequiredMasters}>
            {loadingAction === "create" ? "Adding..." : "Add Labour"}
          </Button>
          {!hasRequiredMasters ? (
            <p className="mt-2 text-xs text-slate-500">Go to Contractor and Site pages to create required master data.</p>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Skill</th>
              <th className="px-3 py-2">Site</th>
              <th className="px-3 py-2">Contractor</th>
              <th className="px-3 py-2">Wage</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labours.map((labour) => (
              <tr key={labour.id} className="border-t">
                <td className="px-3 py-2">{labour.fullName}</td>
                <td className="px-3 py-2">{labour.skillType}</td>
                <td className="px-3 py-2">{labour.assignedSite?.name}</td>
                <td className="px-3 py-2">{labour.contractor?.name}</td>
                <td className="px-3 py-2">{formatCurrency(Number(labour.dailyWage))}</td>
                <td className="px-3 py-2">{labour.status}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(labour)}>Edit</Button>
                    <Button variant="secondary" onClick={() => toggleStatus(labour)} disabled={loadingAction === `toggle:${labour.id}`}>
                      {loadingAction === `toggle:${labour.id}` ? "Saving..." : labour.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="danger" onClick={() => setDeleteLabour(labour)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editLabour}
        title="Edit Labour"
        onClose={() => setEditLabour(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setEditLabour(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={!editLabour || editInvalid || loadingAction === `edit:${editLabour?.id}`}>
              {editLabour && loadingAction === `edit:${editLabour.id}` ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-3">
          <FormField label="Full Name" required error={editErrors.fullName}>
            <Input placeholder="Full name" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
          </FormField>
          <FormField label="Skill Type" required error={editErrors.skillType}>
            <Input placeholder="Skill" value={editForm.skillType} onChange={(e) => setEditForm({ ...editForm, skillType: e.target.value })} />
          </FormField>
          <FormField label="Daily Wage (INR)" required error={editErrors.dailyWage}>
            <Input placeholder="Daily wage" type="number" value={editForm.dailyWage} onChange={(e) => setEditForm({ ...editForm, dailyWage: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteLabour}
        title="Delete Labour"
        message={`Delete ${deleteLabour?.fullName || "this labour"}?`}
        confirmText="Delete"
        loading={!!deleteLabour && loadingAction === `delete:${deleteLabour.id}`}
        onCancel={() => setDeleteLabour(null)}
        onConfirm={confirmDeleteLabour}
      />
    </div>
  );
}
