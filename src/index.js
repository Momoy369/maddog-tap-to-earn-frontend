import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WalletProviderComponent } from "./WalletProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProviderComponent>
      <App />
    </WalletProviderComponent>
  </React.StrictMode>
);
