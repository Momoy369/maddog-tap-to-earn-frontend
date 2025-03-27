import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WalletProviderComponent } from "./WalletProvider";

ReactDOM.render(
  <WalletProviderComponent>
    <App />
  </WalletProviderComponent>,
  document.getElementById("root")
);
