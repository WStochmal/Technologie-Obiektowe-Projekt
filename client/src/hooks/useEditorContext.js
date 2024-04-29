import { EditorContext } from "../context/EditorContext";
import { useContext } from "react";

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
};
