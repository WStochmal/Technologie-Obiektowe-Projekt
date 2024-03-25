import React, { useCallback, useState } from "react";
import ReactFlow, { Controls, Background, MiniMap, Handle } from "reactflow";
import { applyEdgeChanges, applyNodeChanges } from "reactflow";

const data = {
  nodes: [
    {
      id: "1",
      type: "customNode",
      position: {
        x: 100,
        y: 100,
      },
      data: {
        label: "Entity 1",
        attributes: [
          {
            id: "e1",
            label: "Attribute 1",
            type: "String",
          },
          {
            id: "e2",
            label: "Attribute 2",
            type: "Integer",
          },
          {
            id: "e3",
            label: "Attribute 3",
            type: "Integer",
          },
          {
            id: "e4",
            label: "Attribute 4",
            type: "Integer",
          },
          {
            id: "e5",
            label: "Attribute 5",
            type: "Integer",
          },
        ],
      },
    },
    {
      id: "2",
      type: "customNode",
      position: {
        x: 400,
        y: 100,
      },
      data: {
        label: "Entity 2",
        attributes: [
          {
            id: "e6",
            label: "Attribute 6",
            type: "Date",
          },
          {
            id: "e7",
            label: "Attribute 7",
            type: "String",
          },
        ],
      },
    },
  ],
  edges: [
    {
      id: "e1-e6", // Unikalne ID krawędzi
      source: "1", // ID atrybutu źródłowego
      target: "2", // ID atrybutu docelowego
      sourceHandle: "e5-handle",
      targetHandle: "e7-handle",
      label: "to the",
      type: "default",
    },
  ],
};

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

const Test = () => {
  const [nodes, setNodes] = useState(data.nodes);
  const [edges, setEdges] = useState(data.edges);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const handleConnect = (params) => {
    console.log(params);
    const { source, sourceHandle, target, targetHandle } = params;

    const sourceAttributeId = sourceHandle.replace("-handle", ""); // Usuwamy "-handle" z ID źródłowego handle
    const targetAttributeId = targetHandle.replace("-handle", ""); // Usuwamy "-handle" z ID docelowego handle

    const sourceNode = nodes.find((node) =>
      node.data.attributes.some((attr) => attr.id === sourceAttributeId)
    );
    const targetNode = nodes.find((node) =>
      node.data.attributes.some((attr) => attr.id === targetAttributeId)
    );

    if (!sourceNode || !targetNode) {
      return console.error(
        "Nie można znaleźć atrybutów źródłowego lub docelowego"
      );
    }

    const edge = {
      id: `${sourceAttributeId}-${targetAttributeId}`, // Używamy ID atrybutów do identyfikacji krawędzi
      source: sourceAttributeId,
      target: targetAttributeId,
      label: "to the",
      type: "relation",
    };

    setEdges((prevEdges) => [...prevEdges, edge]);
  };

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ customNode: CustomNode }}
        onConnect={handleConnect}
        fitView
        connectionMode="loose"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Test;
