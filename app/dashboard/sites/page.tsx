"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast-provider";
import { formatDate } from "@/lib/utils";
import { isValidDate } from "@/lib/validation";

type Site = {
  id: string;
  name: string;
  state: string;
  city: string;
  projectStart: string;
  projectEnd: string;
  isActive: boolean;
};

type SiteForm = { name: string; state: string; city: string; projectStart: string; projectEnd: string };

const defaultForm: SiteForm = { name: "", state: "", city: "", projectStart: "", projectEnd: "" };

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function SitesPage() {
  const { pushToast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [form, setForm] = useState<SiteForm>(defaultForm);
  const [editSite, setEditSite] = useState<Site | null>(null);
  const [editForm, setEditForm] = useState<SiteForm>(defaultForm);
  const [deleteSite, setDeleteSite] = useState<Site | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SiteForm, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof SiteForm, string>>>({});

  function validateSiteForm(value: SiteForm) {
    const next: Partial<Record<keyof SiteForm, string>> = {};
    if (!value.name.trim()) next.name = "Site name is required";
    if (!value.state.trim()) next.state = "State is required";
    if (!value.city.trim()) next.city = "City is required";
    if (!isValidDate(value.projectStart)) next.projectStart = "Valid start date is required";
    if (!isValidDate(value.projectEnd)) next.projectEnd = "Valid end date is required";
    if (isValidDate(value.projectStart) && isValidDate(value.projectEnd) && new Date(value.projectStart) > new Date(value.projectEnd)) {
      next.projectEnd = "End date must be after start date";
    }
    return next;
  }

  async function load() {
    const res = await fetch("/api/sites");
    if (!res.ok) return pushToast(await getError(res), "error");
    setSites(await res.json());
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialSites() {
      const res = await fetch("/api/sites");
      if (!res.ok) {
        if (!cancelled) {
          pushToast(await getError(res), "error");
        }
        return;
      }

      const data = await res.json() as Site[];
      if (!cancelled) {
        setSites(data);
      }
    }

    void loadInitialSites();

    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  async function createSite() {
    const nextErrors = validateSiteForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("create");
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoadingAction(null);
    if (!res.ok) return pushToast(await getError(res), "error");

    setForm(defaultForm);
    setErrors({});
    pushToast("Site created");
    load();
  }

  function openEdit(site: Site) {
    setEditSite(site);
    setEditForm({
      name: site.name,
      state: site.state,
      city: site.city,
      projectStart: site.projectStart.slice(0, 10),
      projectEnd: site.projectEnd.slice(0, 10)
    });
    setEditErrors({});
  }

  async function saveEdit() {
    if (!editSite) return;
    const nextErrors = validateSiteForm(editForm);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction(`edit:${editSite.id}`);
    const res = await fetch(`/api/sites/${editSite.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setEditSite(null);
    pushToast("Site updated");
    load();
  }

  async function toggleSite(site: Site) {
    setLoadingAction(`toggle:${site.id}`);
    const res = await fetch(`/api/sites/${site.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !site.isActive })
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    pushToast(`Site ${site.isActive ? "deactivated" : "activated"}`);
    load();
  }

  async function confirmDeleteSite() {
    if (!deleteSite) return;
    setLoadingAction(`delete:${deleteSite.id}`);
    const res = await fetch(`/api/sites/${deleteSite.id}`, { method: "DELETE" });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setDeleteSite(null);
    pushToast("Site deleted");
    load();
  }

  const createInvalid = Object.keys(validateSiteForm(form)).length > 0;
  const editInvalid = Object.keys(validateSiteForm(editForm)).length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Multi-Site Management</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <FormField label="Site Name" required error={errors.name}>
            <Input placeholder="Moonext Skyline Residency" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="State" required error={errors.state}>
            <Input placeholder="Madhya Pradesh" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </FormField>
          <FormField label="City" required error={errors.city}>
            <Input placeholder="Bhopal" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </FormField>
          <FormField label="Project Start" required error={errors.projectStart}>
            <Input type="date" value={form.projectStart} onChange={(e) => setForm({ ...form, projectStart: e.target.value })} />
          </FormField>
          <FormField label="Project End" required error={errors.projectEnd}>
            <Input type="date" value={form.projectEnd} onChange={(e) => setForm({ ...form, projectEnd: e.target.value })} />
          </FormField>
        </div>
        <div className="mt-3">
          <Button onClick={createSite} disabled={loadingAction === "create" || createInvalid} className="w-full sm:w-auto">
            {loadingAction === "create" ? "Adding..." : "Add Site"}
          </Button>
        </div>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="table-base min-w-[760px]">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="border-t">
                <td className="px-3 py-2 font-medium whitespace-nowrap">{site.name}</td>
                <td className="px-3 py-2 whitespace-nowrap">{site.city}, {site.state}</td>
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(site.projectStart)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(site.projectEnd)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{site.isActive ? "Active" : "Inactive"}</td>
                <td className="px-3 py-2">
                  <div className="action-stack min-w-[132px]">
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => openEdit(site)}>Edit</Button>
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => toggleSite(site)} disabled={loadingAction === `toggle:${site.id}`}>
                      {loadingAction === `toggle:${site.id}` ? "Saving..." : site.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="danger" className="w-full sm:w-auto" onClick={() => setDeleteSite(site)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!editSite}
        title="Edit Site"
        onClose={() => setEditSite(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setEditSite(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={!editSite || editInvalid || loadingAction === `edit:${editSite?.id}`} className="w-full sm:w-auto">
              {editSite && loadingAction === `edit:${editSite.id}` ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Site Name" required error={editErrors.name}>
            <Input placeholder="Site name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </FormField>
          <FormField label="State" required error={editErrors.state}>
            <Input placeholder="State" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
          </FormField>
          <FormField label="City" required error={editErrors.city}>
            <Input placeholder="City" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
          </FormField>
          <FormField label="Project Start" required error={editErrors.projectStart}>
            <Input type="date" value={editForm.projectStart} onChange={(e) => setEditForm({ ...editForm, projectStart: e.target.value })} />
          </FormField>
          <FormField label="Project End" required error={editErrors.projectEnd}>
            <Input type="date" value={editForm.projectEnd} onChange={(e) => setEditForm({ ...editForm, projectEnd: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteSite}
        title="Delete Site"
        message={`Delete ${deleteSite?.name || "this site"}?`}
        confirmText="Delete"
        loading={!!deleteSite && loadingAction === `delete:${deleteSite.id}`}
        onCancel={() => setDeleteSite(null)}
        onConfirm={confirmDeleteSite}
      />
    </div>
  );
}
