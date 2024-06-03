// libraries
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// hooks
import { useEditorContext } from "../../../hooks/useEditorContext";
import { useAuthContext } from "../../../hooks/useAuthContext";

// styles
import "./editorList.css";

// icons
import icon_table from "../../../assets/icons/table.png";
import icon_search from "../../../assets/icons/search.png";
import icon_plus from "../../../assets/icons/plus.png";
import icon_minus from "../../../assets/icons/minus.png";
import icon_close from "../../../assets/icons/close.png";

const EditorListAttributesWindow = () => {
  const { data, setData, selectedNodeId, setSelectedNodeId } =
    useEditorContext();
  const [selectedNode, setSelectedNode] = useState(null);
  const { user, socket } = useAuthContext();
  const [searchText, setSearchText] = useState("");
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  useEffect(() => {
    if (selectedNodeId) {
      setSelectedNode(
        data.diagram.nodes.find((node) => node.data.label === selectedNodeId)
      );
    }
  }, [data, selectedNodeId]);

  const handleSelectedNode = (nodeLabel) => {
    setSelectedNodeId(nodeLabel);
    setSelectedNode(
      data.diagram.nodes.find((node) => node.data.label === nodeLabel)
    );
  };

  // Handle adding a new node to the diagram
  const handleNodeAdd = () => {
    if (socket) {
      const uuid = uuidv4().replace(/-/g, "");
      const newNode = {
        id: uuidv4(),
        data: {
          label: "New Node",
          color: "#06b",
          attributes: [
            {
              id: uuid,
              label: "ID",
              type: "INT",
              additionalParameters: "",
              defaultType: "no default",
              defaultValue: "",
              foreignKey: false,
              NotNull: true,
              primaryKey: true,
              unique: true,
            },
          ],
        },
        position: {
          x: 100,
          y: 100,
        },
        type: "customNode",
      };
      socket.emit("nodeCreate", { newNode, diagramId: data._id });
      setData((prevData) => {
        return {
          ...prevData,
          diagram: {
            ...prevData.diagram,
            nodes: [...prevData.diagram.nodes, newNode],
          },
        };
      });
    }
  };
  // Handle removing a node from the diagram
  const handleNodeRemove = (nodeId) => {
    setData((prevData) => {
      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: prevData.diagram.nodes.filter((node) => node.id !== nodeId),
        },
      };
    });
    socket.emit("nodeRemove", { nodeId: nodeId, diagramId: data._id });
  };
  // Handle changing node color
  const handleDiagramChangeColor = (nodeId, color) => {
    console.log(nodeId, color);
    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              color: color,
            },
          };
        }
        return node;
      });

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: newNodes,
        },
      };
    });
    socket.emit("nodeChange", {
      type: "color",
      nodeId,
      color,
      label: selectedNode.data.label,
      diagramId: data._id,
    });
  };
  // Handle changing node label
  const handleDiagramChangeLabel = (nodeId, label) => {
    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: label,
            },
          };
        }
        return node;
      });

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: newNodes,
        },
      };
    });

    socket.emit("nodeChange", {
      type: "label",
      nodeId,
      label,
      color: selectedNode.data.color,
      diagramId: data._id,
    });
  };
  // Handle adding a new attribute to the selected node
  const handleDiagramAttributeAdd = (nodeId) => {
    const newAttribute = {
      id: uuidv4(),
      label: "Attribute",
      type: "INT",
      additionalParameters: "",
      defaultType: "no default",
      defaultValue: "",
      foreignKey: false,
      NotNull: false,
      primaryKey: false,
      unique: false,
    };

    socket.emit("attributeCreate", {
      diagramId: data._id,
      nodeId,
      newAttribute,
    });

    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          const newAttributes = [...node.data.attributes, newAttribute];
          return {
            ...node,
            data: {
              ...node.data,
              attributes: newAttributes,
            },
          };
        }
        return node;
      });

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: newNodes,
        },
      };
    });
  };
  // Handle removing an attribute from the selected node
  const handleDiagramAttributeRemove = (nodeId, attributeId) => {
    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          const newAttributes = node.data.attributes.filter(
            (attribute) => attribute.id !== attributeId
          );
          return {
            ...node,
            data: {
              ...node.data,
              attributes: newAttributes,
            },
          };
        }
        return node;
      });

      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: newNodes,
        },
      };
    });
    socket.emit("attributeRemove", {
      diagramId: data._id,
      nodeId,
      attributeId,
    });
  };

  return (
    <div className="editor-list-container">
      {isLeftPanelOpen && (
        <div className="editor-avaliable-tables">
          <div className="editor-avaliable-tables-header">
            <div>
              <img src={icon_table} alt="table" />
              <p>Tables</p>
            </div>

            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                setIsLeftPanelOpen(false);
              }}
            >
              <img src={icon_close} alt="icon_close" />
            </button>
          </div>
          <div className="editor-avaliable-tables-action">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <img src={icon_search} alt="search" />
            </div>
            <button className="btn" onClick={handleNodeAdd}>
              <img src={icon_plus} alt="icon_plus" />
            </button>
          </div>
          <ul className="editor-avaliable-tables-body">
            {data &&
              data.diagram.nodes
                .filter((node) =>
                  node.data.label
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                )
                .map((node, nodeIdx) => {
                  return (
                    <li
                      key={nodeIdx}
                      className="project-node"
                      style={{
                        background:
                          selectedNode === node.id
                            ? "var(--color_blue)"
                            : "initial",
                      }}
                    >
                      <div
                        className="project-node-title"
                        onClick={() => {
                          handleSelectedNode(node.data.label);
                        }}
                      >
                        <img
                          src={icon_table}
                          alt="table"
                          style={{
                            filter:
                              selectedNode === node.id
                                ? "invert(1)"
                                : "initial",
                          }}
                        />
                        <p
                          style={{
                            color:
                              selectedNode === node.id ? "white" : "initial",
                          }}
                        >
                          {node.data.label}
                        </p>
                      </div>
                      <button
                        className="btn"
                        onClick={() => {
                          handleNodeRemove(node.id);
                        }}
                      >
                        <img
                          src={icon_minus}
                          alt="icon_delete"
                          style={{
                            filter:
                              selectedNode === node.id
                                ? "invert(1)"
                                : "initial",
                          }}
                        />
                      </button>
                    </li>
                  );
                })}
          </ul>
        </div>
      )}
      {selectedNode && (
        <div className="editor-avaliable-attributes">
          <div className="editor-avaliable-attributes-main-header">
            <p>Selected node</p>
            <div>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  handleDiagramChangeLabel(selectedNode.id, e.target.value);
                }}
              />
              <input
                className="project-node-color"
                type="color"
                value={selectedNode.data.color}
                onChange={(e) => {
                  e.preventDefault();
                  handleDiagramChangeColor(selectedNode.id, e.target.value);
                }}
              />
            </div>
          </div>

          <div className="editor-avaliable-attributes-header">
            <p className="editor-avaliable-attributes-header-title">
              column name
            </p>
            <p className="editor-avaliable-attributes-header-type">type</p>
            <p className="editor-avaliable-attributes-header-default">
              default
            </p>
            <p className="editor-avaliable-attributes-header-default">
              constraints
            </p>
            <p className="editor-avaliable-attributes-header-remove"></p>
          </div>
          <div className="editor-avaliable-attributes-body">
            {selectedNode &&
              selectedNode.data.attributes.map((attribute, attributeIdx) => {
                return (
                  <div className="project-attribute" key={attributeIdx}>
                    <div className="attribute-elem project-attribute-label">
                      {" "}
                      <input type="text" value={attribute.label} />
                    </div>
                    <div className="attribute-elem project-attribute-type">
                      <input type="text" value={attribute.type} />
                    </div>
                    <div className="attribute-elem project-attribute-default">
                      <select defaultValue={attribute.defaultType}>
                        <option value="no">no default</option>
                        <option value="sequence">sequence</option>
                        <option value="sequence">constant</option>
                      </select>
                      <input type="text" value={attribute.defaultValue} />
                    </div>
                    <div className="attribute-elem project-attribute-constraints">
                      <div className="attribute-constraints">
                        {attribute.primaryKey && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(255,215,0,.5)" }}
                          >
                            Primary key
                          </div>
                        )}
                        {attribute.foreignKey && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(255,228,225,.5)" }}
                          >
                            Foreign Key
                          </div>
                        )}
                        {attribute.unique && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(30,144,255,.5)" }}
                          >
                            Unique
                          </div>
                        )}
                        {attribute.NotNull && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(50,205,50,.5)" }}
                          >
                            Not null
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-bordered"
                        onClick={handleNodeAdd}
                      >
                        <img src={icon_plus} alt="icon_plus" />
                      </button>
                    </div>
                    <div className="attribute-elem project-attribute-remove">
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDiagramAttributeRemove(
                            selectedNode.id,
                            attribute.id
                          );
                        }}
                      >
                        <img src={icon_minus} alt="icon_delete" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <h1
            onClick={(e) => {
              e.preventDefault();
              handleDiagramAttributeAdd(selectedNode.id);
            }}
          >
            Dodaj now atrybut
          </h1>
          {/* <button
            className="btn btn-bordered"
          
          >
            <img src={icon_plus} alt="icon_plus" />
          </button> */}
        </div>
      )}
    </div>
  );
};

export default EditorListAttributesWindow;
