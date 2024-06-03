// libraries
import { useState } from "react";
import { useEditorContext } from "../../../hooks/useEditorContext";
import { v4 as uuidv4 } from "uuid";

//styles
import "./style.css";
import { useAuthContext } from "../../../hooks/useAuthContext";
const ModalNewConnection = ({ params }) => {
  const [sourceType, setSourceType] = useState("");
  const [targetType, setTargetType] = useState("");
  const { setData, data } = useEditorContext();

  const { socket } = useAuthContext();

  const handleSave = () => {
    if (sourceType && targetType && socket) {
      const { source, target, sourceHandle, targetHandle } = params;

      console.log(sourceHandle, targetHandle);

      const sourceHandlePosition = sourceHandle.split("-")[2];
      const targetHandlePosition = targetHandle.split("-")[2];

      const id = uuidv4();
      const edge = {
        id: id,
        source: source,
        target: target,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        type: "smoothstep",
        markerStart: `symbol-${sourceType}-${sourceHandlePosition}`,
        markerEnd: `symbol-${targetType}-${targetHandlePosition}`,
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

      socket.emit("add-edge", { edge, diagramId: data._id });
    }
  };

  return (
    <div className="connection-container">
      <span>
        <p> Source </p>{" "}
        <select
          onChange={(e) => {
            setSourceType(e.target.value);
          }}
        >
          <option value="" disabled selected>
            {" "}
            Wybierz opcję{" "}
          </option>{" "}
          <option value="1"> 1 </option> <option value="n"> N </option>{" "}
        </select>{" "}
      </span>{" "}
      <span>
        <p> Target </p>{" "}
        <select
          onChange={(e) => {
            setTargetType(e.target.value);
          }}
        >
          <option value="" disabled selected>
            {" "}
            Wybierz opcję{" "}
          </option>{" "}
          <option value="1"> 1 </option> <option value="n"> N </option>{" "}
        </select>{" "}
      </span>{" "}
      <button onClick={handleSave}> Save </button>{" "}
    </div>
  );
};

export default ModalNewConnection;
