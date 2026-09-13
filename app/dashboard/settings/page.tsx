"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { isValidEmail, isValidPhone } from "@/lib/validation";

type SettingsProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  siteName: string | null;
  contractorName: string | null;
};

async function getError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.error || "Request failed";
}

function roleLabel(role: string) {
  return role.replaceAll("_", " ");
}

export default function SettingsPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState<SettingsProfile | null>(null);
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loadingState, setLoadingState] = useState<"profile" | "password" | null>(null);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const res = await fetch("/api/settings/profile");
      if (!res.ok) {
        if (!cancelled) pushToast(await getError(res), "error");
        return;
      }

      const data = (await res.json()) as SettingsProfile;
      if (cancelled) return;

      setProfile(data);
      setProfileForm({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || ""
      });
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [pushToast]);

  function validateProfileForm(value: typeof profileForm) {
    const errors: Record<string, string> = {};
    if (value.fullName.trim().length < 2) errors.fullName = "Full name must be at least 2 characters";
    if (!isValidEmail(value.email)) errors.email = "Enter a valid email address";
    if (value.phone && !isValidPhone(value.phone)) errors.phone = "Phone must be 10 digits";
    return errors;
  }

  function validatePasswordForm(value: typeof passwordForm) {
    const errors: Record<string, string> = {};
    if (value.currentPassword.length < 6) errors.currentPassword = "Current password is required";
    if (value.newPassword.length < 6) errors.newPassword = "New password must be at least 6 characters";
    if (value.newPassword && value.newPassword === value.currentPassword) {
      errors.newPassword = "Use a different password";
    }
    if (value.confirmPassword !== value.newPassword) errors.confirmPassword = "Passwords do not match";
    return errors;
  }

  async function saveProfile() {
    const nextErrors = validateProfileForm(profileForm);
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingState("profile");
    const res = await fetch("/api/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm)
    });
    setLoadingState(null);

    if (!res.ok) {
      pushToast(await getError(res), "error");
      return;
    }

    const data = await res.json();
    setProfile(data.user as SettingsProfile);
    setProfileForm({
      fullName: data.user.fullName,
      email: data.user.email,
      phone: data.user.phone || ""
    });
    pushToast("Profile updated");
    router.refresh();
  }

  async function changePassword() {
    const nextErrors = validatePasswordForm(passwordForm);
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingState("password");
    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
    setLoadingState(null);

    if (!res.ok) {
      pushToast(await getError(res), "error");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({});
    pushToast("Password updated");
  }

  const profileInvalid = Object.keys(validateProfileForm(profileForm)).length > 0;
  const passwordInvalid = Object.keys(validatePasswordForm(passwordForm)).length > 0;
  const scopeLabel = profile?.siteName || profile?.contractorName || "All sites and contractors";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] bg-moonext-navy text-white shadow-xl">
        <div className="grid gap-5 p-6 md:p-8 xl:grid-cols-[1.25fr,0.75fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">Settings</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Profile & Security</h1>
            <p className="max-w-2xl text-sm leading-6 text-blue-100/90">
              Keep your admin account details accurate and rotate your password whenever access changes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <SummaryPill label="Role" value={profile ? roleLabel(profile.role) : "Loading..."} />
            <SummaryPill label="Scope" value={profile ? scopeLabel : "Loading..."} />
            <SummaryPill label="Email" value={profile?.email || "Loading..."} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
            <p className="mt-1 text-sm text-slate-600">Update the details shown in your account and header.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required error={profileErrors.fullName}>
              <Input
                placeholder="Admin full name"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
              />
            </FormField>

            <FormField label="Email" required error={profileErrors.email}>
              <Input
                placeholder="admin@moonext.in"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </FormField>

            <FormField label="Phone" error={profileErrors.phone} hint="Optional, 10-digit number">
              <Input
                placeholder="9876543210"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </FormField>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Access Scope</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{scopeLabel}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={saveProfile} disabled={loadingState === "profile" || profileInvalid} className="w-full sm:w-auto">
              {loadingState === "profile" ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => profile && setProfileForm({ fullName: profile.fullName, email: profile.email, phone: profile.phone || "" })}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="surface-card p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
              <p className="mt-1 text-sm text-slate-600">Choose a strong password and avoid reusing old credentials.</p>
            </div>

            <div className="grid gap-4">
              <FormField label="Current Password" required error={passwordErrors.currentPassword}>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </FormField>

              <FormField label="New Password" required error={passwordErrors.newPassword} hint="Use at least 6 characters">
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </FormField>

              <FormField label="Confirm New Password" required error={passwordErrors.confirmPassword}>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </FormField>
            </div>

            <div className="mt-5">
              <Button onClick={changePassword} disabled={loadingState === "password" || passwordInvalid} className="w-full sm:w-auto">
                {loadingState === "password" ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Security Tips</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Use a password that mixes letters and numbers so it is harder to guess.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Update your profile email and phone so account recovery and communication stay reliable.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                Change your password immediately if multiple admins or devices have had access.
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
