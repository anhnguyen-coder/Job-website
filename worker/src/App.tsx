import { useEffect } from "react";
import "./App.css";
import AppRouter from "./router/route";
import { connectSocket } from "./pkg/socket/socket";
import { useSocketNoti } from "./pkg/socket/handler/noti.handler";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);

  useSocketNoti()
  return <AppRouter />;
}

export default App;
