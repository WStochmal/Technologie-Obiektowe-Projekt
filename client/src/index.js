// libraries
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// hooks
import { AuthContextProvider } from "./context/AuthContext";
import { EditorContextProvider } from "./context/EditorContext";
import { ModalWindowContextProvider } from "./context/ModalWindowContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeContextProvider } from "./context/ThemeContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <EditorContextProvider>
      <ThemeContextProvider>
        <ToastProvider>
          <ModalWindowContextProvider>
            <App />
          </ModalWindowContextProvider>{" "}
        </ToastProvider>{" "}
      </ThemeContextProvider>{" "}
    </EditorContextProvider>{" "}
  </AuthContextProvider>
);
