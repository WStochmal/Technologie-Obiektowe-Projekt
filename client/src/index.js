// libraries
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// hooks
import { AuthContextProvider } from "./context/AuthContext";
import { EditorContextProvider } from "./context/EditorContext";
import { ModalWindowContextProvider } from "./context/ModalWindowContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <EditorContextProvider>
      <ModalWindowContextProvider>
        <App />
      </ModalWindowContextProvider>{" "}
    </EditorContextProvider>{" "}
  </AuthContextProvider>
);
