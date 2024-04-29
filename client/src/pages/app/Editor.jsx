import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../../components/editor/node/CustomNode";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEditorContext } from "../../hooks/useEditorContext";
import "../../styles/editor.css";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

function Editor() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { data, setData, activeMembers, setActiveMembers } = useEditorContext();
  const reactFlowWrapper = useRef(null); // Referencja do kontenera ReactFlow

  const [nodes, setNodes] = useNodesState(data?.diagram.nodes);

  useEffect(() => {
    setData(null);
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && data) {
      if (socket.connected) {
        const userId = user?._id;
        console.log("User id: ", userId);
        socket.emit("joinDiagram", { userId });
        const handleJoinDiagram = ({ userId, userSid }) => {
          console.log("User joined diagram");
          const members = data.members;
          console.log("UserID: ", userId);
          console.log("Members: ", members);

          // Sprawdzenie, czy lista members istnieje i czy zawiera użytkowników
          if (members && members.length > 0) {
            // Znajdź użytkownika w liście members o identyfikatorze równym userId
            const user = members.find((member) => member._id === userId);

            // Jeśli użytkownik został znaleziony, dodaj go do listy activeMembers
            if (user) {
              user.userSid = userSid;
              console.log("User: ", user);
              setActiveMembers((prevMembers) => [...prevMembers, user]);
            }
          }
        };

        socket.on("userJoinedDiagram", handleJoinDiagram);

        return () => {
          socket.off("userJoinedDiagram", handleJoinDiagram);
        };
      }
    }
  }, [user, data]);

  const handleNodeDrag = useCallback((event, node) => {
    setData((prevData) => {
      const nodes = prevData.diagram.nodes;
      const updatedNodes = nodes.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            position: {
              x: node.position.x,
              y: node.position.y,
            },
          };
        }
        return n;
      });

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: updatedNodes,
        },
      };
    });
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/diagram/get/${id}`
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnect = (params) => {
    console.log("Connect: ", params);
    const { source, target } = params;
    const edge = {
      id: uuidv4(),
      source: source,
      target: target,
    };

    setData((prevData) => {
      const edges = prevData.diagram.edges;
      const updatedEdges = [...edges, edge];

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          edges: updatedEdges,
        },
      };
    });
  };

  return (
    <div style={{ height: "100%" }}>
      <div ref={reactFlowWrapper} style={{ height: "100%" }}>
        <ReactFlow
          nodes={data?.diagram.nodes}
          edges={data?.diagram.edges}
          // onNodesChange={onNodesChange}
          // onEdgesChange={onEdgesChange}
          onNodeDrag={handleNodeDrag}
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
    </div>
  );
}

export default Editor;
