import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import axios from "axios";
import { AuthContextProvider } from "./context/AuthContext";

axios.defaults.baseURL = "http://localhost:5000/api";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
