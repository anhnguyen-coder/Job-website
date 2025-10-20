import { createContext, useContext } from "react";
import type { CustomerAuthContextType } from "./types";

export const CustomerAuthContext =
  createContext<CustomerAuthContextType | null>(null);

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx)
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
};
