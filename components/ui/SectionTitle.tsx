import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  id?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  id,
}: Props) {
  const dark = tone === "dark";

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "eyebrow-rule mb-4 text-[length:var(--text-eyebrow)] font-bold uppercase tracking-[0.14em]",
            dark ? "text-white/70" : "text-[color:var(--color-text-2)]",
            align === "center" && "flex items-center justify-center",
          )}
        >
          {eyebrow}
        </p>
      )}

      <Heading
        id={id}
        className={cn(
          "text-[length:var(--text-h2)]",
          dark ? "text-white" : "text-[color:var(--color-text)]",
        )}
      >
        {title}
      </Heading>

      {description && (
        <p
          className={cn(
            "mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.65]",
            dark ? "text-white/75" : "text-[color:var(--color-text-2)]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
