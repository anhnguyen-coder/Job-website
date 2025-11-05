import { LoadingOverlay } from "@/components/base/loading";
import { useWorkerAuth } from "@/context/context";
import AuthLayout from "@/layout/auth.layout";
import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "@/pages/signin/page";
import DashBoardPage from "@/pages/dashboard/page";
import AppLayout from "@/layout/app.layout";
import JobListPage from "@/pages/jobs/page";
import SignUpPage from "@/pages/signup/page";

const AppRouter: React.FC = () => {
  const { isAuthenticated, initialized } = useWorkerAuth();

  if (!initialized) return <LoadingOverlay />;

  return (
    <Routes>
      {!isAuthenticated && (
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />}></Route>
          <Route path="signup" element={<SignUpPage />}></Route>
        </Route>
      )}

      {isAuthenticated && (
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashBoardPage />}></Route>
          <Route path="jobs" element={<JobListPage />}></Route>
        </Route>
      )}

      {/* redirect wrong route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} replace />
        }
      />
    </Routes>
  );
};

export default AppRouter;
