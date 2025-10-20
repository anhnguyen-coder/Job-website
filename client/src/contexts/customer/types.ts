export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CustomerAuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  err: string;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  signin: (input: customerSigninInput) => Promise<void>;
  profile: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: customerSignupInput) => Promise<void>;
  resetPassword: (input: resetPasswordInput) => Promise<void>;
}

export interface customerSigninInput {
  email: string;
  password: string;
}

export interface customerSignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface resetPasswordInput {
  email: string;
  password: string;
}
