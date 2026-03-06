import { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
