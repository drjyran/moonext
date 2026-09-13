"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  title?: string;
  description?: string;
  redirectTo?: string;
  variant?: "default" | "light";
};

export function LoginPanel({
  title = "Staff Login",
  description = "Access the internal labour management portal.",
  redirectTo = "/dashboard",
  variant = "default"
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.prefetch(redirectTo);
  }, [redirectTo, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);

    if (!response.ok) {
      let message = `Login failed (${response.status})`;
      try {
        const data = await response.json();
        if (data?.error) message = data.error;
      } catch {
        // Keep fallback
      }
      setError(message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div
      className={
        variant === "light"
          ? "rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
          : "rounded-[28px] border border-white/10 bg-white/10 p-6 text-white backdrop-blur-xl sm:p-8"
      }
    >
      <h2 className={variant === "light" ? "text-2xl font-semibold text-slate-900" : "text-2xl font-semibold text-white"}>{title}</h2>
      <p className={variant === "light" ? "mt-2 text-sm text-slate-600" : "mt-2 text-sm text-blue-100/90"}>{description}</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Access Portal"}</Button>
      </form>
    </div>
  );
}
