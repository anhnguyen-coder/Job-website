import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "@/layouts/customer.layout";
import Page from "@/pages/customer/jobs/page";
import { useCustomerAuth } from "@/contexts/customer";
import SignIn from "@/pages/customer/auth/signin/signIn";
import AuthLayout from "@/layouts/auth.layout";
import { SignUp } from "@/pages/customer/auth/signup/page";
import ForgotPasswordPage from "@/pages/customer/auth/forgotPassword/page";

const NotFound: React.FC = () => {
  return <div>404 Not Found</div>;
};

const CustomerAppRouters: React.FC = () => {
  const customerContext = useCustomerAuth();
  const { profile, loading, isAuthenticated } = customerContext;

  useEffect(() => {
    profile();
  }, [profile]);

  return (
    <>
      {!loading && (
        <Routes>
          <Route path="customer" element={<CustomerLayout />}>
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
              <Route path="dashboard" element={<Page />}></Route>
            )}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

export default CustomerAppRouters;
