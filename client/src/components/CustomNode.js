// CustomNode.js
import React, { useState } from "react";
import ReactFlow, { Handle } from "reactflow";

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        border: "1px solid #000",
        borderRadius: "0.25rem",
        backgroundColor: "#FFF",
        position: "relative",
        width: "260px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          padding: "0.5rem",
          boxSizing: "border-box",
          borderBottom: "1px solid var(--color_grey)",
        }}
      >
        {data.label}
      </div>
      {data.attributes.map((attribute) => (
        <div
          key={attribute.id}
          style={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
            borderBottom: "1px solid var(--color_grey)",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "15%",
              borderRight: "1px solid var(--color_grey)",
              boxSizing: "border-box",
              padding: "0.25rem",
            }}
          ></div>
          <div
            style={{
              width: "45%",
              boxSizing: "border-box",
              borderRight: "1px solid var(--color_grey)",
              padding: "0.25rem",
            }}
          >
            {attribute.label}
          </div>
          <div
            style={{
              width: "40%",
              boxSizing: "border-box",
              padding: "0.25rem",
            }}
          >
            {attribute.type}
          </div>
          <Handle
            position="right"
            style={{
              background: "#555",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            id={`${attribute.id}-handle`} // Dodaj "-handle" do ID, aby odróżnić handle atrybutu
            type="source" // Określamy typ handle jako źródło
            isConnectable={true}
          />
        </div>
      ))}
    </div>
  );
};

export default CustomNode;
