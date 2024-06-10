import { ToastContext } from "../context/ToastContext";
import { useContext } from "react";

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
};
