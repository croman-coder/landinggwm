import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-neutral-900 text-white text-xs font-semibold px-3 py-1", className)}>
      {children}
    </span>
  );
}
