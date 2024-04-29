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
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../../components/editor/node/CustomNode";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEditorContext } from "../../hooks/useEditorContext";
import "../../styles/editor.css";
import io from "socket.io-client";

function Editor() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { data, setData, activeMembers, setActiveMembers } = useEditorContext();
  const reactFlowWrapper = useRef(null); // Referencja do kontenera ReactFlow

  const socket = io("http://127.0.0.1:5000");

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

  const handleConnect = (params) => {};
  const onNodesChange = useCallback((changes) => {});
  const onEdgesChange = useCallback((changes) => {});

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

  return (
    <div style={{ height: "100%" }}>
      <div ref={reactFlowWrapper} style={{ height: "100%" }}>
        <ReactFlow
          nodes={data?.diagram.nodes}
          edges={data?.diagram.edges}
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
    </div>
  );
}

export default Editor;
