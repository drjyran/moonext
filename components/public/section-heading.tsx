import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  invert?: boolean;
  tone?: "orange" | "rose" | "emerald" | "sky" | "violet";
};

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  orange: "border-orange-200/70 bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 text-orange-700",
  rose: "border-rose-200/70 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 text-rose-700",
  emerald: "border-emerald-200/70 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 text-emerald-700",
  sky: "border-sky-200/70 bg-gradient-to-r from-sky-50 via-indigo-50 to-violet-50 text-sky-700",
  violet: "border-violet-200/70 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-rose-50 text-violet-700"
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  tone = "orange"
}: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("inline-flex items-center gap-3", align === "center" && "justify-center")}>
        <span
          className={cn(
            "h-[3px] w-10 animate-gradient-pan rounded-full bg-[length:220%_100%]",
            invert
              ? "bg-[linear-gradient(90deg,#fdba74,#f472b6,#a78bfa,#67e8f9,#fdba74)]"
              : "bg-[linear-gradient(90deg,#fb7185,#f59e0b,#10b981,#0ea5e9,#8b5cf6,#fb7185)]"
          )}
        />
        <p
          className={cn(
            "animate-pop-in rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em]",
            invert ? "border border-white/15 bg-white/10 text-orange-100" : `border ${toneStyles[tone]}`
          )}
        >
          {eyebrow}
        </p>
      </div>
      <h2
        className={cn(
          "public-display mt-5 animate-rise-in text-4xl font-semibold tracking-tight md:text-5xl",
          invert ? "text-white" : "text-slate-950"
        )}
      >
        {title}
      </h2>
      <p className={cn("mt-5 text-base leading-7 md:text-lg", invert ? "text-slate-200" : "text-slate-600")}>
        {description}
      </p>
    </div>
  );
}

