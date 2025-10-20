import { Button } from "@/components/base/button";
import { useCustomerAuth } from "@/contexts/customer";
import React from "react";

const Page: React.FC = () => {
  const customerContext = useCustomerAuth();
  return (
    <div>
      <Button onClick={() => customerContext.signOut()}>Log out</Button>
    </div>
  );
};

export default Page;
