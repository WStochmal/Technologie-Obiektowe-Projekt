// CustomAttribute.js
import React, { useState } from "react";
import { Handle } from "reactflow";

// style
import "./attribute.css";

const CustomAttribute = ({ data }) => {
  return (
    <div className="nodrag custom-attribute">
      <p> {data.label} </p> <p className="greyText"> {data.type} </p>{" "}
      <Handle
        position="right"
        style={{
          background: "#b4b4b6",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id={`${data.id}-handle`}
        type="source"
        isConnectable={true}
      />{" "}
      <Handle
        position="left"
        style={{
          background: "#b4b4b6",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id={`${data.id}-handle`}
        type="source"
        isConnectable={true}
      />{" "}
    </div>
  );
};

export default CustomAttribute;
