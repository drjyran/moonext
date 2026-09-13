"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast-provider";
import { isValidEmail, isValidPhone } from "@/lib/validation";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "SITE_MANAGER" | "CONTRACTOR";
};

type Site = { id: string; name: string };
type Contractor = { id: string; name: string };

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

export default function UsersPage() {
  const { pushToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "SITE_MANAGER",
    siteId: "",
    contractorId: ""
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<User["role"]>("SITE_MANAGER");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateCreate(value: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    siteId: string;
    contractorId: string;
  }) {
    const next: Record<string, string> = {};
    if (!value.fullName.trim()) next.fullName = "Full name is required";
    if (!isValidEmail(value.email)) next.email = "Invalid email";
    if (value.phone && !isValidPhone(value.phone)) next.phone = "Phone must be 10 digits";
    if (value.password.length < 6) next.password = "Password must be at least 6 characters";
    if (value.role === "SITE_MANAGER" && !value.siteId) next.siteId = "Site is required for Site Manager";
    if (value.role === "CONTRACTOR" && !value.contractorId) next.contractorId = "Contractor is required for Contractor role";
    return next;
  }

  async function load() {
    const [u, s, c] = await Promise.all([fetch("/api/users"), fetch("/api/sites"), fetch("/api/contractors")]);
    if (!u.ok) return pushToast(await getError(u), "error");
    if (!s.ok) return pushToast(await getError(s), "error");
    if (!c.ok) return pushToast(await getError(c), "error");
    setUsers(await u.json());
    setSites(await s.json());
    setContractors(await c.json());
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialUsers() {
      const [u, s, c] = await Promise.all([fetch("/api/users"), fetch("/api/sites"), fetch("/api/contractors")]);
      if (!u.ok) {
        if (!cancelled) {
          pushToast(await getError(u), "error");
        }
        return;
      }
      if (!s.ok) {
        if (!cancelled) {
          pushToast(await getError(s), "error");
        }
        return;
      }
      if (!c.ok) {
        if (!cancelled) {
          pushToast(await getError(c), "error");
        }
        return;
      }

      const [usersData, sitesData, contractorsData] = await Promise.all([
        u.json() as Promise<User[]>,
        s.json() as Promise<Site[]>,
        c.json() as Promise<Contractor[]>
      ]);

      if (!cancelled) {
        setUsers(usersData);
        setSites(sitesData);
        setContractors(contractorsData);
      }
    }

    void loadInitialUsers();

    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  async function createUser() {
    const nextErrors = validateCreate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction("create");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");

    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "SITE_MANAGER",
      siteId: "",
      contractorId: ""
    });
    setErrors({});
    pushToast("User created");
    load();
  }

  function openEdit(user: User) {
    setEditUser(user);
    setEditRole(user.role);
  }

  async function saveRole() {
    if (!editUser) return;
    setLoadingAction(`edit:${editUser.id}`);
    const res = await fetch(`/api/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole })
    });
    setLoadingAction(null);
    if (!res.ok) return pushToast(await getError(res), "error");

    setEditUser(null);
    pushToast("User role updated");
    load();
  }

  async function confirmDeleteUser() {
    if (!deleteUser) return;
    setLoadingAction(`delete:${deleteUser.id}`);
    const res = await fetch(`/api/users/${deleteUser.id}`, { method: "DELETE" });
    setLoadingAction(null);

    if (!res.ok) return pushToast(await getError(res), "error");
    setDeleteUser(null);
    pushToast("User deleted");
    load();
  }

  const createInvalid = Object.keys(validateCreate(form)).length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User & Role Management (Admin)</h2>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <FormField label="Full Name" required error={errors.fullName}>
            <Input placeholder="Rajesh Yadav" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <Input placeholder="manager@moonext.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone" error={errors.phone} hint="Optional, 10-digit number">
            <Input placeholder="9000000002" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Password" required error={errors.password} hint="Minimum 6 characters">
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <FormField label="Role" required error={errors.role}>
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ADMIN">Admin</option>
              <option value="SITE_MANAGER">Site Manager</option>
              <option value="CONTRACTOR">Contractor</option>
            </Select>
          </FormField>
          <FormField label="Assign Site" error={errors.siteId} hint={form.role === "SITE_MANAGER" ? "Required for Site Manager" : "Optional"}>
            <Select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}>
              <option value="">Assign site (optional)</option>
              {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Assign Contractor" error={errors.contractorId} hint={form.role === "CONTRACTOR" ? "Required for Contractor role" : "Optional"}>
            <Select value={form.contractorId} onChange={(e) => setForm({ ...form, contractorId: e.target.value })}>
              <option value="">Assign contractor (optional)</option>
              {contractors.map((contractor) => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="mt-3">
          <Button onClick={createUser} disabled={loadingAction === "create" || createInvalid} className="w-full sm:w-auto">
            {loadingAction === "create" ? "Creating..." : "Create User"}
          </Button>
        </div>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="table-base min-w-[720px]">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-3 py-2 font-medium whitespace-nowrap">{user.fullName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{user.role}</td>
                <td className="px-3 py-2">
                  <div className="action-stack min-w-[132px]">
                    <Button variant="secondary" className="w-full sm:w-auto" onClick={() => openEdit(user)}>Edit Role</Button>
                    <Button variant="danger" className="w-full sm:w-auto" onClick={() => setDeleteUser(user)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!editUser}
        title="Edit User Role"
        onClose={() => setEditUser(null)}
        footer={(
          <>
            <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={saveRole} disabled={!editUser || loadingAction === `edit:${editUser?.id}`} className="w-full sm:w-auto">
              {editUser && loadingAction === `edit:${editUser.id}` ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-2">
          <p className="text-sm text-slate-600">{editUser?.fullName} ({editUser?.email})</p>
          <Select value={editRole} onChange={(e) => setEditRole(e.target.value as User["role"])}>
            <option value="ADMIN">ADMIN</option>
            <option value="SITE_MANAGER">SITE_MANAGER</option>
            <option value="CONTRACTOR">CONTRACTOR</option>
          </Select>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteUser}
        title="Delete User"
        message={`Delete ${deleteUser?.fullName || "this user"}?`}
        confirmText="Delete"
        loading={!!deleteUser && loadingAction === `delete:${deleteUser.id}`}
        onCancel={() => setDeleteUser(null)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}
