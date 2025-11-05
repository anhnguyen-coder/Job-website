import { createContext, useContext } from "react";
import type { WorkerAuthContextType } from "./type";


export const WorkerAuthContext = createContext<WorkerAuthContextType | null>(
  null
);

export const useWorkerAuth = () => {
  const ctx = useContext(WorkerAuthContext);
  if (!ctx)
    throw new Error("useWorkerAuth must be used within AdminAuthProvider");
  return ctx;
};