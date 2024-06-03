import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState();
  const [activeMembers, setActiveMembers] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  return (
    <EditorContext.Provider
      value={{
        data,
        setData,
        activeMembers,
        selectedNodeId,
        setActiveMembers,
        setSelectedNodeId,
      }}
    >
      {children}{" "}
    </EditorContext.Provider>
  );
};
