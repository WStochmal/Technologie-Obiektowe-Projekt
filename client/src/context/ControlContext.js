// libraries
import React, { createContext, useEffect, useState } from "react";

// context
export const ControlContext = createContext();

export const ControlContextProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const handleTabPress = (event) => {
      if (event.keyCode === 17 && event.ctrlKey) {
        setIsEditMode(!isEditMode);
        console.log("CTRL + E pressed");
      }
    };

    document.addEventListener("keydown", handleTabPress);

    return () => {
      document.removeEventListener("keydown", handleTabPress);
    };
  }, [isEditMode]);

  return (
    <ControlContext.Provider value={{ isEditMode }}>
      {" "}
      {children}{" "}
    </ControlContext.Provider>
  );
};
