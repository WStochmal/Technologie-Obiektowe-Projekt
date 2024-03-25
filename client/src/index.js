import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { EditorContextProvider } from "./context/EditorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <EditorContextProvider>
    <App />
  </EditorContextProvider>
);
