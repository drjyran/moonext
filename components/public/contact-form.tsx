"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServiceContent } from "@/lib/website-content";

type Props = {
  services: ServiceContent[];
};

export function ContactForm({ services }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    service: services[0]?.title ?? "Building Construction",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);

    if (!response.ok) {
      let message = `Unable to send inquiry (${response.status})`;
      try {
        const data = await response.json();
        if (data?.error) {
          message = data.error;
        }
      } catch {
        // Keep fallback
      }
      setError(message);
      return;
    }

    setForm({
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      service: services[0]?.title ?? "Building Construction",
      message: ""
    });
    setSuccess("Your inquiry has been received. Moonext will get back to you shortly.");
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="public-panel space-y-5" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-moonext-orange">Project Inquiry</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Tell us about your requirement</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Share your project scope, location, and service requirement. This form is ready for later CRM or email integration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
        />
        <Input
          placeholder="Company name"
          value={form.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
        />
        <Input
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
        />
        <Input
          placeholder="Phone number"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          required
        />
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Service required</span>
          <select
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-moonext-orange"
            value={form.service}
            onChange={(event) => updateField("service", event.target.value)}
            required
          >
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700">Project details</span>
          <textarea
            className="min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-moonext-orange sm:text-sm"
            placeholder="Tell us about your project scope, site location, timeline, and any immediate support required."
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            required
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "Sending Inquiry..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
