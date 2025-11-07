import { useState } from "react";
import { Button } from "../base/button";
import { Input } from "../base/input";

interface findWithEmail {
  email: string;
  handleFindByEmail: () => Promise<void>;
  setEmail: (email: string) => void;
  err: string;
  isExist?: boolean;

  password?: string;
  setPassword: (password: string) => void;
  handleResetPassword: () => void;
}

export function FindWithEmailWorker({
  email,
  setEmail,
  handleFindByEmail,
  err,
  isExist,
  password,
  setPassword,
  handleResetPassword,
}: findWithEmail) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    isExist ? handleResetPassword() : handleFindByEmail();
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-120">
      <div className="bg-white rounded-2xl">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-10">
          {!isExist && (
            <>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    iconClassName="bx bx-envelope text-slate-400"
                  />
                </div>
              </div>
            </>
          )}

          {isExist && (
            <>
              {/* New Password Field */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
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
            </>
          )}

          {/* Error message */}
          {err && <p className="text-red-500 text-sm">{err}</p>}

          {/* Login Button */}
          <div className="flex justify-center mb-4">
            <Button
              type="submit"
              className="w-[50%] h-11 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg text-green-800 mt-6"
            >
              {isExist ? "Reset password" : "Find Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
