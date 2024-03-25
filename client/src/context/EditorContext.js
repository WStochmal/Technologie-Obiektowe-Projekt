import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState();

  const handleSetData = (data) => {
    setData(data);
  };
  return (
    <EditorContext.Provider
      value={{
        data,
        setData,
        handleSetData,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
