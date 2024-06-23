// libraries
import html2canvas from "html2canvas";
import io from "socket.io-client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";

// styles
import "../../styles/editor.css";
import "reactflow/dist/style.css";

// hooks
import { useModalWindowContext } from "../../hooks/useModalWindowContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEditorContext } from "../../hooks/useEditorContext";

// components
import CustomNode from "../../components/editor/node/CustomNode";
import Loader from "../../common/loader/Loader";
import EditorListAttributesWindow from "../../components/editor/main-views/EditorListAttributesWindow";

// context
import { ControlContextProvider } from "../../context/ControlContext";

// svg
import Connections from "../../assets/svg/Connections";

function Editor() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { user, socket } = useAuthContext();
  const { data, setData, activeMembers, setActiveMembers, selectedNodeId } =
    useEditorContext();
  const { openModal } = useModalWindowContext();
  const reactFlowRef = useRef(null);
  const [isUserEmitted, setIsUserEmitted] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState("50%");
  const [rightPanelWidth, setRightPanelWidth] = useState("50%");
  const { setViewport } = useReactFlow();

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const reactFlowWrapper = useRef(null); // Referencja do kontenera ReactFlow

  const [nodes, setNodes] = useNodesState(data?.diagram.nodes);

  const [displayFullData, setDisplayFullData] = useState(false);

  useEffect(() => {
    setData(null);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const joinDiagram = () => {
        if (user && socket.connected) {
          const userId = user._id;
          socket.emit("joinDiagram", { userId });
        }
      };

      const handleJoinDiagram = ({ userId, userSid }) => {
        console.log("User joined diagram");
        if (data && data.members && data.members.length > 0) {
          const user = data.members.find((member) => member._id === userId);
          if (user) {
            user.userSid = userSid;
            setActiveMembers((prevMembers) => [...prevMembers, user]);
          }
        }
      };
      if (user && data) {
        if (isUserEmitted === false) {
          setIsUserEmitted(true);
          joinDiagram();
        }
      }
      if (socket) {
      }
      socket.on("userJoinedDiagram", handleJoinDiagram);

      return () => {
        socket.off("userJoinedDiagram", handleJoinDiagram);
      };
    }
  }, [user, data, socket]);

  const handleNodeDrag = useCallback((event, node) => {
    console.log("Emitted node drag: ", node);

    const dataToSend = {
      id: id,
      node: node,
    };
    socket.emit("nodeDrag", dataToSend);
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

  const handleSocketNodeDrag = useCallback((node) => {
    console.log("Socket on: ", node);

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
      setIsLoading(false);
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
    openModal("ConnectionModal", params);
  };

  const handleConnectionRemove = (params) => {
    console.log("Remove connection: ", params[0]);
    const { id } = params[0];
    console.log(id);
    setData((prevData) => {
      const edges = prevData.diagram.edges;
      const updatedEdges = edges.filter((edge) => edge.id !== id);
      console.log(edges);
      console.log(updatedEdges);

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          edges: updatedEdges,
        },
      };
    });
  };

  useEffect(() => {
    if (socket) {
      // Dodanie nasłuchiwania zdarzeń tylko po zamontowaniu komponentu
      if (user) {
        document.addEventListener("mousemove", handleMouseMove);
        socket.on("otherCursorMove", handleOtherCursorMove);
        socket.on("userLeftDiagram", handleUserLeftDiagram);
        socket.on("nodeDragged", (data) => {
          handleSocketNodeDrag(data.node);
        });
      }

      return () => {
        // Usunięcie nasłuchiwania zdarzeń po odmontowaniu komponentu
        document.removeEventListener("mousemove", handleMouseMove);
        socket.off("otherCursorMove", handleOtherCursorMove);
        socket.off("userLeftDiagram", handleUserLeftDiagram);
        socket.off("nodeDragged", handleSocketNodeDrag);
      };
    }
  }, [user, socket]);

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
    if (user && socket && !isLoading) {
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

  const handleNodeRemove = async (params) => {
    if (socket) {
      socket.emit("nodeRemove", { node: params[0], diagramId: data._id });
    }
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener("mousemove", handleMouseMovz);
    document.addEventListener("mouseup", handleMouseUp);

    console.log("Mouse down");
  };

  const handleMouseMovz = (e) => {
    const containerWidth = document.getElementById("editorWindow").offsetWidth;
    const newRightPanelWidth = containerWidth - e.clientX;
    setLeftPanelWidth(`${e.clientX}px`);
    setRightPanelWidth(`${newRightPanelWidth}px`);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMovz);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (data) {
      console.log(selectedNodeId);
      const selectedNode = data?.diagram.nodes.find(
        (node) => node.data.label === selectedNodeId
      );
      if (selectedNode) {
        setViewport(
          { x: selectedNode.position.x, y: selectedNode.position.y, zoom: 1 },
          { duration: 800 }
        );
      }
    }
  }, [selectedNodeId]);

  // const handleTransform = useCallback(() => {
  //   setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  // }, [setViewport]);

  return (
    <div id="editorWindow">
      {parseInt(leftPanelWidth) > 150 && (
        <div
          className="editorPanel"
          id="editorLeftPanel"
          style={{
            width: leftPanelWidth,
            flex: parseInt(leftPanelWidth) <= 150 ? "none" : 1,
          }}
        >
          <ControlContextProvider>
            <div style={{ height: "100%", width: "100%" }}>
              {isLoading && <Loader />}
              {!isLoading && (
                <div
                  ref={reactFlowWrapper}
                  style={{
                    height: "100%",
                    background: "var(--color_background_primary)",
                  }}
                >
                  <Connections />
                  <ReactFlow
                    ref={reactFlowRef}
                    nodes={data?.diagram.nodes}
                    edges={data?.diagram.edges}
                    // onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                    onNodeDrag={handleNodeDrag}
                    onNodesDelete={handleNodeRemove}
                    onEdgesDelete={handleConnectionRemove}
                    nodeTypes={nodeTypes}
                    onConnect={handleConnect}
                    // fitView
                    connectionMode="loose"
                  >
                    <Background />
                    {isMapVisible && <MiniMap />}
                    {isControlsVisible && <Controls />}
                  </ReactFlow>
                </div>
              )}
            </div>
          </ControlContextProvider>
        </div>
      )}
      <div id="separator" onMouseDown={handleMouseDown}></div>
      {parseInt(rightPanelWidth) > 150 && (
        <div
          className="editorPanel"
          id="editorRightPanel"
          style={{
            width: rightPanelWidth,
            flex: parseInt(leftPanelWidth) <= 150 ? 1 : "none",
          }}
        >
          <EditorListAttributesWindow />
        </div>
      )}
    </div>
  );
}

// export default Editor;

export default () => (
  <ReactFlowProvider>
    <Editor />
  </ReactFlowProvider>
);
