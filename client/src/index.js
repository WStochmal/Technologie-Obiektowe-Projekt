// libraries
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// hooks
import { AuthContextProvider } from "./context/AuthContext";
import { EditorContextProvider } from "./context/EditorContext";
import { ModalWindowContextProvider } from "./context/ModalWindowContext";
import { ToastProvider } from "./context/ToastContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <EditorContextProvider>
      <ToastProvider>
        <ModalWindowContextProvider>
          <App />
        </ModalWindowContextProvider>{" "}
      </ToastProvider>{" "}
    </EditorContextProvider>{" "}
  </AuthContextProvider>
);
