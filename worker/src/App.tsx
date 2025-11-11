import { useEffect } from "react";
import "./App.css";
import AppRouter from "./router/route";
import { connectSocket } from "./pkg/socket/socket";

function App() {
  useEffect(() => {
    connectSocket();
  }, []);
  return <AppRouter />;
}

export default App;
