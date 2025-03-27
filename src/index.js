import React from "react";
import ReactDOM from "react-dom/client"; // Pastikan menggunakan "react-dom/client"
import App from "./App";
import { WalletProviderComponent } from "./WalletProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WalletProviderComponent>
      <App />
    </WalletProviderComponent>
  </React.StrictMode>
);
