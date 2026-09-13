import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition focus:outline-none focus:ring-2 focus:ring-moonext-orange/40 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11",
        variant === "primary" && "bg-moonext-navy text-white hover:bg-blue-900",
        variant === "secondary" && "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}
