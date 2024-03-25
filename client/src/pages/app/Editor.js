import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
//const { v4: uuidv4 } = require("uuid");

import { v4 as uuidv4 } from "uuid";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../../components/CustomNode";

import { useEditorContext } from "../../hooks/useEditorContext";

function Editor() {
  const [nodes, setNodes] = useState();
  const [edges, setEdges] = useState();
  const { id } = useParams();

  const { data, setData } = useEditorContext();

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  useEffect(() => {
    if (data && id) {
      const index = data.findIndex((item) => item.id === parseInt(id));
      setNodes(data[index].nodes);
      setEdges(data[index].edges);
    }
  }, [data, id]);

  const handleDeleteDiagram = () => {};
  const handleAddDiagram = () => {
    const index = data.findIndex((item) => item.id === parseInt(id));
    const newNode = {
      id: uuidv4(),
      type: "customNode",
      position: {
        x: 400,
        y: 100,
      },
      data: {
        label: "Entity added",
        attributes: [
          {
            id: uuidv4(),
            label: "Attribute 6",
            type: "Date",
          },
        ],
      },
    };
    const updatedNodes = [...data[index].nodes, newNode];
    const updatedData = [...data];
    updatedData[index].nodes = updatedNodes;
    setData(updatedData);
  };
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

    const newEdge = {
      id: `${sourceAttributeId}-${targetAttributeId}`, // Używamy ID atrybutów do identyfikacji krawędzi
      source: source,
      target: target,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      type: "default",
    };
    const index = data.findIndex((item) => item.id === parseInt(id));

    const updateEdges = [...data[index].edges, newEdge];
    const updatedData = [...data];
    updatedData[index].edges = updateEdges;

    console.log(updatedData);

    setEdges(updatedData);
  };

  return (
    <div style={{ height: "100%" }}>
      <button
        style={{ position: "absolute", zIndex: 2 }}
        onClick={handleAddDiagram}
      >
        <p>Dodaj</p>
      </button>
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
    </div>
  );
}

export default Editor;
