import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "@/layouts/customer.layout";
// import Page from "@/pages/customer/jobs/page";
import { useCustomerAuth } from "@/contexts/customer";
import SignIn from "@/pages/auth/signin/signIn";
import AuthLayout from "@/layouts/auth.layout";
import { SignUp } from "@/pages/auth/signup/page";
import ForgotPasswordPage from "@/pages/auth/forgotPassword/page";
import DashBoard from "@/pages/dashboard/page";
import JobsPage from "@/pages/jobs/page";
import JobIdPage from "@/pages/jobs/_id/page";
import JobCreatePage from "@/pages/jobs/create/page";
import JobRequestList from "@/pages/jobs/request/page";
import { LoadingOverlay } from "@/components/base/loading";
import RatingPageView from "@/pages/rating/page";

const CustomerAppRouters: React.FC = () => {
  const customerContext = useCustomerAuth();
  const { loading, isAuthenticated } = customerContext;

  if (loading) return <LoadingOverlay />;
  return (
    <>
      {!loading && (
        <Routes>
          {/* public routes */}
          {!isAuthenticated && !loading && (
            <Route element={<AuthLayout />}>
              <Route path="signin" element={<SignIn />}></Route>
              <Route path="signup" element={<SignUp />}></Route>
              <Route
                path="reset-password"
                element={<ForgotPasswordPage />}
              ></Route>
            </Route>
          )}

          {/* private routes */}
          {isAuthenticated && !loading && (
            <Route element={<CustomerLayout />}>
              <Route path="dashboard" element={<DashBoard />}></Route>
              <Route path="jobs" element={<JobsPage />}></Route>
              <Route path="jobs/:jobId" element={<JobIdPage />}></Route>
              <Route path="create-job" element={<JobCreatePage />}></Route>
              <Route path="job-request" element={<JobRequestList />}></Route>
              <Route path="rating" element={<RatingPageView />}></Route>
            </Route>
          )}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/signin"}
                replace
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

export default CustomerAppRouters;
