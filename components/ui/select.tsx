import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moonext-orange", props.className)} />;
}
