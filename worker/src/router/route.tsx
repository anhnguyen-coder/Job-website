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
import JobIDPage from "@/pages/jobs/id/page";
import ForgotPasswordPage from "@/pages/forgotPassword/page";
import BookmarkPage from "@/pages/bookmark/page";

const AppRouter: React.FC = () => {
  const { isAuthenticated, loading } = useWorkerAuth();

  if (loading) return <LoadingOverlay />;

  return (
    <Routes>
      {!isAuthenticated && (
        <Route element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />}></Route>
          <Route path="signup" element={<SignUpPage />}></Route>
          <Route path="reset-password" element={<ForgotPasswordPage />}></Route>
        </Route>
      )}

      {isAuthenticated && (
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashBoardPage />}></Route>
          <Route path="jobs" element={<JobListPage />}></Route>
          <Route path="jobs/:jobId" element={<JobIDPage />}></Route>
          <Route path="bookmarked" element={<BookmarkPage />}></Route>
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
