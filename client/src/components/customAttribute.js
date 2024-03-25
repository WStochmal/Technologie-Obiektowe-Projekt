// CustomAttribute.js
import React, { useState } from "react";
import { Handle } from "react-flow-renderer";

const CustomAttribute = ({ data, onConnectAttribute }) => {
  const [selectedNode, setSelectedNode] = useState("");

  const handleConnect = () => {
    onConnectAttribute(data.id);
  };

  return (
    <div className="custom-node-attribute">
      <Handle type="source" position="right" style={{ background: "#555" }} />
      <div>
        <p>{data.label}</p>
        <button onClick={handleConnect}>Connect</button>
      </div>
      <div>
        <p>Type: {data.type}</p>
      </div>
      <Handle type="target" position="left" style={{ background: "#555" }} />
    </div>
  );
};

export default CustomAttribute;
