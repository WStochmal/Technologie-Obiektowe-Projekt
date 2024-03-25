import { EditorContext } from "../context/EditorContext";
import { useContext } from "react";

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
