// libraries
import { useState } from "react";
import { useEditorContext } from "../../../hooks/useEditorContext";
import { v4 as uuidv4 } from "uuid";

//styles
import "./style.css";
import { useAuthContext } from "../../../hooks/useAuthContext";
const ModalNewConnection = ({ params }) => {
  console.log("Params: ", params);
  const [sourceType, setSourceType] = useState("");
  const [targetType, setTargetType] = useState("");
  const { setData, data } = useEditorContext();

  const { socket } = useAuthContext();

  const handleSave = () => {
    if (sourceType && targetType && socket) {
      const { source, target, sourceHandle, targetHandle } = params;

      console.log(sourceHandle, targetHandle);

      const sourceHandlePosition = getColumnAndPosition(sourceHandle);
      const targetHandlePosition = getColumnAndPosition(targetHandle);

      console.log(sourceHandlePosition, targetHandlePosition);

      const id = uuidv4();
      const edge = {
        id: id,
        source: source,
        target: target,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        type: "smoothstep",
        markerStart: `symbol-${sourceType}-${sourceHandlePosition.position}`,
        markerEnd: `symbol-${targetType}-${targetHandlePosition.position}`,
      };

      // Check if source and target nodes have primary keys
      const sourceNode = data.diagram.nodes.find((node) => node.id === source);
      const targetNode = data.diagram.nodes.find((node) => node.id === target);

      console.log(sourceNode, targetNode);
      const sourcePrimaryKey = sourceNode.data.attributes.find(
        (attr) => attr.primaryKey
      );
      const targetPrimaryKey = targetNode.data.attributes.find(
        (attr) => attr.primaryKey
      );
      console.log("-----------------");
      console.log(sourcePrimaryKey, targetPrimaryKey);
      if (!sourcePrimaryKey && targetPrimaryKey) {
        // Set foreignKey to true for source node's appropriate attribute
        const sourceForeignKeyAttr = sourceNode.data.attributes.find(
          (attr) => attr.id === sourceHandle
        );
        if (sourceForeignKeyAttr) {
          sourceForeignKeyAttr.foreignKey = true;
        }
      } else if (sourcePrimaryKey && !targetPrimaryKey) {
        // Set foreignKey to true for target node's appropriate attribute
        const targetForeignKeyAttr = targetNode.data.attributes.find(
          (attr) => attr.id === targetHandle
        );
        if (targetForeignKeyAttr) {
          targetForeignKeyAttr.foreignKey = true;
        }
      }

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

  const getColumnAndPosition = (handle) => {
    const handleParts = handle.split("-handle-");
    return {
      position: handleParts[1],
    };
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
