import React, { createContext, useState } from "react";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const [data, setData] = useState();
  const [diagrams, setDiagrams] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  return (
    <EditorContext.Provider
      value={{
        data,
        setData,
        diagrams,
        setDiagrams,
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
