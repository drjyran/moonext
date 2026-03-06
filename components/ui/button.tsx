import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition",
        variant === "primary" && "bg-moonext-navy text-white hover:bg-blue-900",
        variant === "secondary" && "bg-white border border-slate-300 text-slate-800 hover:bg-slate-50",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}
