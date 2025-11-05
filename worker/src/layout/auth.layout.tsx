import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen mx-auto flex items-center justify-center">
      <div className="min-w-lg m-auto bg-white p-8 rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
