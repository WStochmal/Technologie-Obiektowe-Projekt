import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
//const { v4: uuidv4 } = require("uuid");

import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../../components/editor/node/CustomNode";

import { useEditorContext } from "../../hooks/useEditorContext";
import CustomConnectionLine from "../../components/editor/connectionLine/CustomConnectionLine";

function Editor() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { id } = useParams();

  const { data, setData } = useEditorContext();

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));

    if (data && id) {
      const index = data.findIndex((item) => item.id === parseInt(id));

      if (index !== -1) {
        // Kopia danych, aby nie modyfikować oryginalnego obiektu
        const newData = [...data];
        // Kopia węzła, aby nie modyfikować oryginalnego obiektu
        const updatedNode = {
          ...newData[index].nodes.find((node) => node.id === changes.id),
        };

        // Aktualizacja pozycji x i y na podstawie changes

        // Aktualizacja pozycji x i y na podstawie changes
        if (
          changes.position &&
          changes.position.x !== undefined &&
          changes.position.y !== undefined
        ) {
          console.log(changes);
          updatedNode.position.x = changes.position.x;
          updatedNode.position.y = changes.position.y;
        }

        // Aktualizacja węzła w newData
        newData[index].nodes = newData[index].nodes.map((node) =>
          node.id === changes.id ? updatedNode : node
        );
        console.log(newData);

        // Ustawienie nowych danych
        setData(newData);
      }
    }
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
      id: `${sourceAttributeId}-${targetAttributeId}`,
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

  const handleGenerateSQL = async () => {
    const index = data.findIndex((item) => item.id === parseInt(id));

    if (index !== -1) {
      const sendData = data[index];

      console.log(sendData);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/generate_sql",
          sendData
        );

        // Tutaj możesz obsłużyć odpowiedź od serwera
        console.log("SQL statements:", response.data.sql_statements);
      } catch (error) {
        // Obsługa błędów, np. wyświetlenie komunikatu o błędzie
        console.error("Error generating SQL:", error);
      }
    } else {
      console.error("Item not found");
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <button
        style={{ position: "absolute", zIndex: 2 }}
        onClick={handleAddDiagram}
      >
        <p>Dodaj</p>
      </button>
      <button
        style={{ position: "absolute", zIndex: 2, left: "400px" }}
        onClick={handleGenerateSQL}
      >
        <p>Generuj</p>
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
          // connectionLineComponent={CustomConnectionLine}
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
