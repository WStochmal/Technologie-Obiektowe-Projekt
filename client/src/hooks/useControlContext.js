// libraries
import { useContext } from "react";

// context
import { ControlContext } from "../context/ControlContext";

export const useControlContext = () => {
  const context = useContext(ControlContext);
  if (!context) {
    throw new Error(
      "useControlContext must be used within a ControlContextProvider"
    );
  }
  return context;
};
