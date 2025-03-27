import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WalletProviderComponent } from "./WalletProvider";

ReactDOM.render(
  <React.StrictMode>
    <WalletProviderComponent>
      <App />
    </WalletProviderComponent>
  </React.StrictMode>,
  document.getElementById("root")
);
