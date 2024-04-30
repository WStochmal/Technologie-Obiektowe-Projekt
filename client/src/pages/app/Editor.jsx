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
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../../components/editor/node/CustomNode";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEditorContext } from "../../hooks/useEditorContext";
import "../../styles/editor.css";
import io from "socket.io-client";
import html2canvas from "html2canvas";

const socket = io("http://127.0.0.1:5000");

function Editor() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { data, setData, activeMembers, setActiveMembers } = useEditorContext();
  const reactFlowRef = useRef(null);
  const [isUserEmitted, setIsUserEmitted] = useState(false);
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
    const joinDiagram = () => {
      if (user && socket.connected) {
        const userId = user._id;
        console.log("User id: ", userId);
        socket.emit("joinDiagram", { userId });
      }
    };

    const handleJoinDiagram = ({ userId, userSid }) => {
      console.log("User joined diagram");
      if (data && data.members && data.members.length > 0) {
        const user = data.members.find((member) => member._id === userId);
        if (user) {
          user.userSid = userSid;
          console.log("User: ", user);
          setActiveMembers((prevMembers) => [...prevMembers, user]);
        }
      }
    };

    if (user && data) {
      if (isUserEmitted === false) {
        console.log("LOG 2");
        setIsUserEmitted(true);
        joinDiagram();
      }
    }
    socket.on("userJoinedDiagram", handleJoinDiagram);
    return () => {
      socket.off("userJoinedDiagram", handleJoinDiagram);
    };
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

  const convertMarkerType = (markerType) => {
    console.log("Marker type: ", markerType);
    switch (markerType) {
      case "MarkerType.ArrowClosed":
        return MarkerType.ArrowClosed;
      default:
        return "arrow";
    }
  };

  const handleConnect = (params) => {
    console.log(data);
    console.log("Connect: ", params);
    console.log(data);
    const { source, target, sourceHandle, targetHandle } = params;
    const id = uuidv4();
    const edge = {
      id: id,
      source: source,
      target: target,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      type: "smoothstep",
    };

    console.log("Edge: ", edge);

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

  const takeScreenshot = () => {
    if (reactFlowRef.current) {
      html2canvas(reactFlowRef.current).then((canvas) => {
        // Uzyskano zrzut ekranu jako obiekt canvas
        // Tutaj można go wykorzystać dalej, np. zapisać go jako plik PNG
        canvas.toBlob((blob) => {
          // Tworzenie obiektu URL z bloba
          const url = URL.createObjectURL(blob);

          // Tworzenie linku do pobrania
          const link = document.createElement("a");
          link.href = url;
          link.download = "screenshot.png";

          // Kliknięcie linku w celu pobrania
          link.click();

          // Zwolnienie zasobów URL po pobraniu
          URL.revokeObjectURL(url);
        }, "image/png");
      });
    }
  };

  useEffect(() => {
    // Dodanie nasłuchiwania zdarzeń tylko po zamontowaniu komponentu
    if (user) {
      document.addEventListener("mousemove", handleMouseMove);
      socket.on("otherCursorMove", handleOtherCursorMove);
      socket.on("userLeftDiagram", handleUserLeftDiagram);
    }

    return () => {
      // Usunięcie nasłuchiwania zdarzeń po odmontowaniu komponentu
      document.removeEventListener("mousemove", handleMouseMove);
      socket.off("otherCursorMove", handleOtherCursorMove);
      socket.off("userLeftDiagram", handleUserLeftDiagram);
    };
  }, [user]);

  const handleUserLeftDiagram = ({ userSid }) => {
    setActiveMembers((prevMembers) =>
      prevMembers.filter((member) => member.userSid !== userSid)
    );
    removeCursorByUserSid(userSid);
  };

  const handleOtherCursorMove = ({ userSid, username, x, y }) => {
    renderOtherCursor(userSid, username, x, y);
  };

  const renderOtherCursor = (userSid, username, x, y) => {
    const cursorElement = document.querySelector(
      `.other-cursor[data-userSid="${userSid}"]`
    );
    if (cursorElement) {
      cursorElement.style.left = `${x * 100}%`; // Przekształcenie pozycji X z powrotem na piksele
      cursorElement.style.top = `${y * 100}%`; // Przekształcenie pozycji Y z powrotem na piksele
    } else {
      const cursor = document.createElement("div");
      cursor.classList.add("other-cursor");
      cursor.setAttribute("data-userSid", userSid);
      cursor.innerText = username;
      cursor.style.position = "absolute";
      cursor.style.left = `${x * 100}%`;
      cursor.style.top = `${y * 100}%`;
      document.body.appendChild(cursor);
    }
  };

  function removeCursorByUserSid(userSid) {
    const cursorElements = document.querySelectorAll(
      `.other-cursor[data-userSid="${userSid}"]`
    );

    // Sprawdź, czy znaleziono elementy pasujące do userSid
    if (cursorElements.length > 0) {
      cursorElements.forEach((element) => {
        element.remove(); // Usuń znaleziony element z DOM
      });
    } else {
    }
  }

  const handleMouseMove = (event) => {
    if (user) {
      const { clientX, clientY } = event;
      const { width, height } =
        reactFlowWrapper.current.getBoundingClientRect(); // Pobranie szerokości i wysokości kontenera ReactFlow
      const x = clientX / width; // Przekształcenie pozycji X na jednostki procentowe
      const y = clientY / height; // Przekształcenie pozycji Y na jednostki procentowe
      const userInfo = {
        x,
        y,
        username: user.firstname + " ",
      };
      socket.emit("cursorMove", userInfo);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <button
        style={{ position: "absolute", zIndex: "10000" }}
        onClick={takeScreenshot}
      >
        Take screenshot
      </button>
      <div ref={reactFlowWrapper} style={{ height: "100%" }}>
        <svg style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <marker
              id="symbol-1"
              viewBox="0 0 40 40"
              markerHeight={40}
              markerWidth={40}
              refX={-5}
              refY={5}
            >
              <path
                d="M0,0 L0,10"
                stroke="#b2b2b4"
                strokeWidth="2"
                fill="white"
              />
            </marker>
            <marker
              id="symbol-n"
              viewBox="-1 -1 40 40"
              markerHeight={40}
              markerWidth={40}
              refX="0" // Przesunięcie od końca krawędzi, aby strzałka była umieszczona na linii
              refY="5" // Przesunięcie w pionie, aby strzałka była umieszczona na linii
              orient="auto-start" // Automatyczna orientacja strzałki wzdłuż krawędzi
            >
              {/* Lewa skośna linia strzałki */}
              <line
                x1="0"
                y1="0"
                x2="10"
                y2="5"
                stroke="#b2b2b4"
                strokeWidth="1"
              />
              {/* Prawa skośna linia strzałki */}
              <line
                x1=""
                y1="10"
                x2="10"
                y2="5"
                stroke="#b2b2b4"
                strokeWidth="1"
              />
            </marker>
          </defs>
        </svg>
        <ReactFlow
          ref={reactFlowRef}
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
