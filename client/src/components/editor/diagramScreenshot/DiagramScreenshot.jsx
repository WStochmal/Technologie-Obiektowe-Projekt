// libraries
import { useMemo } from "react";
import ReactFlow from "reactflow";

// components
import CustomNode from "../node/CustomNode";
import Connections from "../../../assets/svg/Connections";

const DiagramScreenshot = ({ data, params }) => {
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
  return (
    <div
      style={{
        height: "1000px",
        width: params.width,
        background: "var(--color_light_grey)",
      }}
    >
      {params.type === "PDF" && (
        <h1 style={{ width: "100%", padding: "0.5rem" }}>{data.label}</h1>
      )}
      <Connections />
      <ReactFlow
        nodes={data?.diagram.nodes}
        edges={data?.diagram.edges}
        fitView
        connectionMode="loose"
        nodeTypes={nodeTypes}
      ></ReactFlow>
    </div>
  );
};

export default DiagramScreenshot;
