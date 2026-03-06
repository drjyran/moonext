"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@moonext.in");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      let message = `Login failed (${response.status})`;
      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await response.json();
          message = data.error || message;
        } else {
          const text = await response.text();
          if (text) message = text.slice(0, 120);
        }
      } catch {
        // Ignore parsing issues and show fallback message
      }
      setError(message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-moonext-navy to-blue-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-moonext-navy">Moonext Constructions</h1>
        <p className="mb-6 text-sm text-slate-600">Labour Management System</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </main>
  );
}
