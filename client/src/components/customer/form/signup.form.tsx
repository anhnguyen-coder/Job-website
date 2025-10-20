import type React from "react";
import { Input } from "@/components/base/input";
import { useState } from "react";
import { Button } from "@/components/base/button";
import type { customerSignupInput } from "@/contexts/customer";

interface signUpFormProps {
  input: customerSignupInput;
  setInput: (input: customerSignupInput) => void;
  handleSignUp: () => Promise<void>;
  err: string;
}

export function SignUpForm({
  input,
  setInput,
  handleSignUp,
  err,
}: signUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp();
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          {/* Name Field */}
          <div className="space-y-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-500 flex items-start"
            >
              User name
            </label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Joshua Smith"
                required
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                iconClassName="bx bx-envelope text-slate-400"
              />
            </div>
          </div>

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

          {/* Confirm Password Field */}
          <div className="space-y-4">
            <label
              htmlFor="ConfirmPassword"
              className="block text-sm font-medium text-slate-500 flex items-start"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="ConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={input.confirmPassword}
                required
                onChange={(e) =>
                  setInput({ ...input, confirmPassword: e.target.value })
                }
                iconClassName="bx bx-lock-alt text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showConfirmPassword ? (
                  <i className="bx bx-show-alt w-5 h-5"></i>
                ) : (
                  <i className="bx bx-hide w-5 h-5"></i>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {err && <p className="text-red-500 text-sm font-medium">{err}</p>}

          {/* Login Button */}
          <div className="flex justify-center mb-4">
            <Button
              type="submit"
              className="w-[50%] h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg text-green-800 mt-6"
            >
              Sign Up
            </Button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <a
            href="/customer/signin"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Sign In Now!
          </a>
        </p>
      </div>
    </div>
  );
}
