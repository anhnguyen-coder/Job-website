import React, { useEffect, type ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  authContext: {
    isAuthenticated: boolean;
    loading: boolean;
  };
  children?: ReactNode;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  authContext,
  redirectTo = "/customer/signin",
}) => {
  const { isAuthenticated, loading } = authContext;

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
