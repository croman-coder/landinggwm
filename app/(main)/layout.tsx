import type { ReactNode } from "react";
import { PageChrome } from "@/components/layout/PageChrome";

/** Landing general (los 3 modelos) y /gracias: Header/Footer completos. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return <PageChrome>{children}</PageChrome>;
}
