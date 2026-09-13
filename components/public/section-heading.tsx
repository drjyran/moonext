import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false
}: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <div className={cn("inline-flex items-center gap-3", align === "center" && "justify-center")}>
        <span
          className={cn(
            "h-px w-10 bg-gradient-to-r",
            invert ? "from-orange-200/0 via-orange-200 to-orange-200/0" : "from-moonext-orange/0 via-moonext-orange to-moonext-orange/0"
          )}
        />
        <p
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em]",
            invert ? "border border-white/10 bg-white/5 text-orange-200" : "border border-slate-200 bg-white/80 text-moonext-orange"
          )}
        >
          {eyebrow}
        </p>
      </div>
      <h2
        className={cn(
          "public-display mt-5 text-4xl font-semibold tracking-tight md:text-5xl",
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
