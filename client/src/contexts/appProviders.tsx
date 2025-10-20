import type { ReactNode } from "react";
import { CustomerAuthProvider } from "./customer";

export function AppProviders({ children }: { children: ReactNode }) {
  return <CustomerAuthProvider> {children}</CustomerAuthProvider>;
}
