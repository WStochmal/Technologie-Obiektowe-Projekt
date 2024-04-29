// CustomNode.js
import React, { useState } from "react";
import ReactFlow, { Handle } from "reactflow";

import CustomAttribute from "../attribute/customAttribute";

import "./nodes.css";

const CustomNode = ({ data }) => {
  const [isActive, setIsActive] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    console.log("Double");
    setIsEditing(true);
  };
  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="custom-node">
      {" "}
      {data.color && (
        <div className="custom-node-color" style={{ background: data.color }}>
          {" "}
        </div>
      )}{" "}
      <div className="custom-node-label">
        {" "}
        {isEditing ? (
          <input
            type="text"
            value={data.label}
            // onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <p onDoubleClick={handleDoubleClick}> {data.label} </p>
        )}{" "}
      </div>{" "}
      {data.attributes.map((attribute) => {
        return <CustomAttribute key={attribute.id} data={attribute} />;
      })}{" "}
      {/* <div>adssda</div> */}{" "}
    </div>
  );
};

export default CustomNode;
