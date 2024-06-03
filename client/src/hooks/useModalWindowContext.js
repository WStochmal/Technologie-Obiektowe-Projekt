import { ModalWindowContext } from "../context/ModalWindowContext";
import { useContext } from "react";

export const useModalWindowContext = () => {
  const context = useContext(ModalWindowContext);
  if (!context) {
    throw new Error(
      "useModalWindowContext must be used within a ModalWindowContextProvider"
    );
  }
  return context;
};
