import { useEffect } from "react";
import "./App.css";
import CustomerAppRouters from "./router/customer.routes";
import { connectSocket } from "./pkg/socket/socket";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  return <CustomerAppRouters />;
}

export default App;
