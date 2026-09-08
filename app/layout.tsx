import type { ReactNode } from "react";

// Кореневий layout — навмисно "прозорий": реальний <html lang="..">
// задається у app/[locale]/layout.tsx, бо мова відома лише там.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
