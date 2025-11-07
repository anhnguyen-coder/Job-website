import type React from "react";
import { Input } from "@/components/base/input";
import { useState } from "react";
import { Button } from "@/components/base/button";
import type { customerSigninInput } from "@/contexts/customer";

interface signnFormProps {
  input: customerSigninInput;
  setInput: (input: customerSigninInput) => void;
  handleSignIn: () => Promise<void>;
  err: string;
}

export function SignInForm({
  input,
  setInput,
  handleSignIn,
  err,
}: signnFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          {/* Email Field */}
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-500 flex items-start"
            >
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="abc@gmail.com"
                required
                value={input.email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                iconClassName="bx bx-envelope text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-500 flex items-start"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={input.password}
                required
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
                iconClassName="bx bx-lock-alt text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? (
                  <i className="bx bx-show-alt w-5 h-5"></i>
                ) : (
                  <i className="bx bx-hide w-5 h-5"></i>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {err && <p className="text-red-500 text-sm font-medium">{err}</p>}

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-2">
            <a
              href="/reset-password"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <div className="flex justify-center mb-4">
            <Button
              type="submit"
              className="w-[50%] h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg text-green-800 mt-6"
            >
              Log In
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-slate-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
