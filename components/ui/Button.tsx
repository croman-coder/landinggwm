import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "whatsapp" | "inverse";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-gwm)] text-white hover:bg-[color:var(--color-gwm-hover)] active:scale-[0.98]",
  outline:
    "border-2 border-[color:var(--color-text)] text-[color:var(--color-text)] hover:bg-[color:var(--color-text)] hover:text-white active:scale-[0.98]",
  ghost:
    "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)] active:scale-[0.98]",
  whatsapp:
    "bg-[color:var(--color-whatsapp)] text-white hover:brightness-95 active:scale-[0.98]",
  inverse:
    "border-2 border-white/70 text-white hover:bg-white hover:text-[color:var(--color-ink)] active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-6 text-[0.9375rem]",
  lg: "min-h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  prefetch?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.06em] " +
  "transition-[background-color,color,transform,border-color,filter] duration-[--dur-base] ease-[--ease-out] " +
  "disabled:pointer-events-none disabled:opacity-50";

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props as CommonProps &
    Record<string, unknown> & { href?: string; target?: string; rel?: string };

  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if (typeof rest.href === "string") {
    const { href, target, rel, prefetch, ...linkRest } = rest as ButtonAsLink & {
      prefetch?: boolean;
    };
    const external = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target={target ?? (href.startsWith("http") ? "_blank" : undefined)}
          rel={rel ?? (href.startsWith("http") ? "noopener noreferrer" : undefined)}
          {...linkRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} prefetch={prefetch} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } =
    rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
