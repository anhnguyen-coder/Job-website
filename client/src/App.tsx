import { useEffect } from "react";
import "./App.css";
import CustomerAppRouters from "./router/customer.routes";
import { connectSocket } from "./pkg/socket/socket";
import { useSocketNoti } from "./pkg/socket/handler/noti.handler";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  useSocketNoti();
  return <CustomerAppRouters />;
}

export default App;
