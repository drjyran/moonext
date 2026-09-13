"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast-provider";
import { isValidEmail, isValidPhone } from "@/lib/validation";

type Contractor = { id: string; name: string; phone: string; email?: string; _count?: { labours: number } };
type ContractorForm = { name: string; phone: string; email: string; address?: string };

const defaultForm: ContractorForm = { name: "", phone: "", email: "", address: "" };

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function ContractorsPage() {
  const { pushToast } = useToast();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [form, setForm] = useState<ContractorForm>(defaultForm);
  const [editContractor, setEditContractor] = useState<Contractor | null>(null);
  const [editForm, setEditForm] = useState<ContractorForm>(defaultForm);
  const [deleteContractor, setDeleteContractor] = useState<Contractor | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContractorForm, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof ContractorForm, string>>>({});

  function validateContractorForm(value: ContractorForm) {
    const next: Partial<Record<keyof ContractorForm, string>> = {};
    if (!value.name.trim()) next.name = "Name is required";
    if (!isValidPhone(value.phone)) next.phone = "Phone must be 10 digits";
    if (value.email && !isValidEmail(value.email)) next.email = "Invalid email";
    return next;
  }

  async function load() {
    const res = await fetch("/api/contractors");
    if (!res.ok) return pushToast(await getError(res), "error");
    setContractors(await res.json());
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialContractors() {
      const res = await fetch("/api/contractors");
      if (!res.ok) {
        if (!cancelled) {
          pushToast(await getError(res), "error");
        }
        return;
      }

      const data = await res.json() as Contractor[];
      if (!cancelled) {
        setContractors(data);
      }
    }

    void loadInitialContractors();

    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  async function createContractor() {
    const nextErrors = validateContractorForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("create");
    const res = await fetch("/api/contractors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoadingAction(null);
    if (!res.ok) return pushToast(await getError(res), "error");

    setForm(defaultForm);
    setErrors({});
    pushToast("Contractor added");
    load();
  }

  function openEdit(contractor: Contractor) {
    setEditContractor(contractor);
    setEditForm({ name: contractor.name, phone: contractor.phone, email: contractor.email || "", address: "" });
    setEditErrors({});
  }

  async function saveEdit() {
    if (!editContractor) return;
    const nextErrors = validateContractorForm(editForm);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction(`edit:${editContractor.id}`);
    const res = await fetch(`/api/contractors/${editContractor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setEditContractor(null);
    pushToast("Contractor updated");
    load();
  }

  async function confirmDeleteContractor() {
    if (!deleteContractor) return;
    setLoadingAction(`delete:${deleteContractor.id}`);
    const res = await fetch(`/api/contractors/${deleteContractor.id}`, { method: "DELETE" });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setDeleteContractor(null);
    pushToast("Contractor deleted");
    load();
  }

  const createInvalid = Object.keys(validateContractorForm(form)).length > 0;
  const editInvalid = Object.keys(validateContractorForm(editForm)).length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contractor Management</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <FormField label="Contractor Name" required error={errors.name}>
            <Input placeholder="Sharma Infra Services" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Phone" required error={errors.phone} hint="10-digit mobile number">
            <Input placeholder="9898989898" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <Input placeholder="contractor@moonext.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
        </div>
        <div className="mt-3">
          <Button onClick={createContractor} disabled={loadingAction === "create" || createInvalid} className="w-full sm:w-auto">
            {loadingAction === "create" ? "Adding..." : "Add Contractor"}
          </Button>
        </div>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="table-base min-w-[720px]">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Workers</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor) => (
              <tr key={contractor.id} className="border-t">
                <td className="px-3 py-2 font-medium whitespace-nowrap">{contractor.name}</td>
                <td className="px-3 py-2 whitespace-nowrap">{contractor.phone}</td>
                <td className="px-3 py-2 whitespace-nowrap">{contractor.email || "-"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{contractor._count?.labours ?? 0}</td>
                <td className="px-3 py-2">
                  <div className="action-stack min-w-[124px]">
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => openEdit(contractor)}>Edit</Button>
                    <Button variant="danger" className="w-full sm:w-auto" onClick={() => setDeleteContractor(contractor)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!editContractor}
        title="Edit Contractor"
        onClose={() => setEditContractor(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setEditContractor(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={!editContractor || editInvalid || loadingAction === `edit:${editContractor?.id}`} className="w-full sm:w-auto">
              {editContractor && loadingAction === `edit:${editContractor.id}` ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-3">
          <FormField label="Contractor Name" required error={editErrors.name}>
            <Input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </FormField>
          <FormField label="Phone" required error={editErrors.phone} hint="10-digit mobile number">
            <Input placeholder="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          </FormField>
          <FormField label="Email" error={editErrors.email}>
            <Input placeholder="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteContractor}
        title="Delete Contractor"
        message={`Delete ${deleteContractor?.name || "this contractor"}?`}
        confirmText="Delete"
        loading={!!deleteContractor && loadingAction === `delete:${deleteContractor.id}`}
        onCancel={() => setDeleteContractor(null)}
        onConfirm={confirmDeleteContractor}
      />
    </div>
  );
}
