"use client";

import { cn } from "@/lib/utils";

const orbStyles = [
  "bg-[radial-gradient(circle,rgba(251,113,133,0.55),transparent_70%)]",
  "bg-[radial-gradient(circle,rgba(251,191,36,0.55),transparent_70%)]",
  "bg-[radial-gradient(circle,rgba(20,184,166,0.5),transparent_70%)]",
  "bg-[radial-gradient(circle,rgba(99,102,241,0.55),transparent_70%)]",
  "bg-[radial-gradient(circle,rgba(217,70,239,0.48),transparent_70%)]",
  "bg-[radial-gradient(circle,rgba(14,165,233,0.5),transparent_70%)]"
];

const positions = [
  "left-[-8%] top-[-12%] h-72 w-72 animate-float-slow",
  "right-[-6%] top-[8%] h-80 w-80 animate-float-fast",
  "left-[12%] bottom-[-18%] h-96 w-96 animate-drift",
  "right-[10%] bottom-[-12%] h-64 w-64 animate-float-slow",
  "left-[42%] top-[-20%] h-56 w-56 animate-drift",
  "right-[34%] bottom-[-24%] h-72 w-72 animate-float-fast"
];

export function FloatingOrbs({ count = 6, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: Math.min(count, orbStyles.length) }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "absolute rounded-full blur-3xl",
            dark ? "opacity-30" : "opacity-45",
            orbStyles[index % orbStyles.length],
            positions[index % positions.length]
          )}
        />
      ))}
      <span aria-hidden className="absolute inset-0 animate-gradient-pan bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.08)_45%,transparent_70%)] bg-[length:220%_100%]" />
    </div>
  );
}
