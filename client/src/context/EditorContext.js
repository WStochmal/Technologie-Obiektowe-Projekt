import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState();
  const [activeMembers, setActiveMembers] = useState([]);

  return (
    <EditorContext.Provider
      value={{
        data,
        setData,
        activeMembers,
        setActiveMembers,
      }}
    >
      {children}{" "}
    </EditorContext.Provider>
  );
};
