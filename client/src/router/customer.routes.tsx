import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/customer.layout";
// import Page from "@/pages/customer/jobs/page";
import { useCustomerAuth } from "@/contexts/customer";
import SignIn from "@/pages/customer/auth/signin/signIn";
import AuthLayout from "@/layouts/auth.layout";
import { SignUp } from "@/pages/customer/auth/signup/page";
import ForgotPasswordPage from "@/pages/customer/auth/forgotPassword/page";
import DashBoard from "@/pages/customer/dashboard/page";
import JobsPage from "@/pages/customer/jobs/page";
import JobIdPage from "@/pages/customer/jobs/_id/page";
import JobCreatePage from "@/pages/customer/jobs/create/page";

const NotFound: React.FC = () => {
  return <div>404 Not Found</div>;
};

const CustomerAppRouters: React.FC = () => {
  const customerContext = useCustomerAuth();
  const { validateToken, loading, isAuthenticated } = customerContext;

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <>
      {!loading && (
        <Routes>
          <Route path="customer">
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
              </Route>
            )}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

export default CustomerAppRouters;
