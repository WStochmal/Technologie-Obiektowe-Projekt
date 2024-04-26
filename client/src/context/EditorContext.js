import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState();

  return (
    <EditorContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
