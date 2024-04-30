// CustomNode.js
import React, { useState } from "react";
import ReactFlow, { Handle } from "reactflow";

import CustomAttribute from "../attribute/customAttribute";

import "./nodes.css";

const CustomNode = ({ data }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive); // Przełączamy stan aktywności węzła po kliknięciu
  };

  const handleDragStart = () => {
    setIsActive(true); // Ustawiamy aktywność węzła na true na początku przeciągania
    setIsDragging(true); // Ustawiamy stan przeciągania na true
  };

  const handleDragStop = () => {
    setIsDragging(false); // Ustawiamy stan przeciągania na false po zakończeniu przeciągania
  };

  return (
    <div
      className={`custom-node ${isActive ? "activeNode" : ""} 
      }`}
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragStop}
    >
      {data.color && (
        <div
          className="custom-node-color"
          style={{ background: data.color }}
        ></div>
      )}{" "}
      <div className="custom-node-label">
        <p> {data.label} </p>{" "}
      </div>{" "}
      {data.attributes.map((attribute) => {
        return <CustomAttribute key={attribute.id} data={attribute} />;
      })}{" "}
    </div>
  );
};

export default CustomNode;
