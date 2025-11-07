import type { UserInterface } from "@/pkg/interfaces/user.type";

export interface WorkerAuthContextType {
  worker: UserInterface | null;
  loading: boolean;
  isAuthenticated: boolean;
  err: string;
  setWorker: (worker: UserInterface | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  signin: (input: WorkerSigninInput) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: WorkerSignUpInput) => Promise<void>;
  profile: () => Promise<void>;
  resetPassword: (input: resetPasswordInput) => Promise<void>;
}

export interface WorkerSigninInput {
  email: string;
  password: string;
}

export interface WorkerSignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string
}

export interface resetPasswordInput {
  email: string;
  password: string;
}
