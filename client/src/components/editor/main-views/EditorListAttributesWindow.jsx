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

// svg
import KeyIcon from "../../../assets/svg/Key";
import UniqueIcon from "../../../assets/svg/Unique";
import NotNullIcon from "../../../assets/svg/NotNull";

const EditorListAttributesWindow = () => {
  const { data, setData, selectedNodeId, setSelectedNodeId } =
    useEditorContext();
  const [selectedNode, setSelectedNode] = useState(null);
  const { user, socket } = useAuthContext();
  const [searchText, setSearchText] = useState("");
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isAttributeContexMenuOpen, setIsAttributeContexMenuOpen] =
    useState(false);
  const [contextAttributeId, setContextAttributeId] = useState(null);

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
              notNull: true,
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
      id: uuidv4().replace(/-/g, "_"),
      label: "Attribute",
      type: "INT",
      additionalParameters: "",
      defaultType: "none",
      defaultValue: "",
      foreignKey: false,
      notNull: false,
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

  const handleDiagramAttributeChange = (
    nodeId,
    attributeId,
    label,
    type,
    additionalParameters,
    defaultType,
    defaultValue,
    foreignKey,
    notNull,
    primaryKey,
    unique
  ) => {
    const node = data.diagram.nodes.find((node) => node.id === nodeId);
    const attribute = node
      ? node.data.attributes.find((attr) => attr.id === attributeId)
      : null;

    const changedAttribute = {
      attributeId: attributeId,
      label: label || (attribute ? attribute.label : ""),
      type: type || (attribute ? attribute.type : ""),
      additionalParameters:
        additionalParameters ||
        (attribute ? attribute.additionalParameters : ""),
      defaultType: defaultType || (attribute ? attribute.defaultType : ""),
      defaultValue: defaultValue || (attribute ? attribute.defaultValue : ""),
      foreignKey:
        foreignKey !== undefined
          ? foreignKey
          : attribute
          ? attribute.foreignKey
          : false,
      notNull:
        notNull !== undefined ? notNull : attribute ? attribute.notNull : false,
      primaryKey:
        primaryKey !== undefined
          ? primaryKey
          : attribute
          ? attribute.primaryKey
          : false,
      unique:
        unique !== undefined ? unique : attribute ? attribute.unique : false,
    };
    console.log(changedAttribute);

    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          const newAttributes = node.data.attributes.map((attr) => {
            if (attr.id === attributeId) {
              return {
                ...attr,
                ...changedAttribute,
              };
            }
            return attr;
          });
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

    socket.emit("attributeChange", {
      changedAttribute,
      diagramId: data._id,
      nodeId: nodeId,
    });
  };

  const handleOpenContextMenu = (attributeId) => {
    setIsAttributeContexMenuOpen(true);
    setContextAttributeId(attributeId);
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
                      <input
                        type="text"
                        value={attribute.label}
                        onChange={(e) => {
                          handleDiagramAttributeChange(
                            selectedNode.id,
                            attribute.id,
                            e.target.value,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined
                          );
                        }}
                      />
                    </div>
                    <div className="attribute-elem project-attribute-type">
                      <input
                        type="text"
                        value={attribute.type}
                        onChange={(e) => {
                          handleDiagramAttributeChange(
                            selectedNode.id,
                            attribute.id,
                            undefined,
                            e.target.value,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined
                          );
                        }}
                      />
                    </div>
                    <div className="attribute-elem project-attribute-default">
                      <select
                        defaultValue={attribute.defaultType}
                        onChange={(e) => {
                          handleDiagramAttributeChange(
                            selectedNode.id,
                            attribute.id,
                            undefined,
                            undefined,
                            undefined,
                            e.target.value,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            undefined
                          );
                        }}
                      >
                        <option value="none">no default</option>
                        <option value="sequence">sequence</option>
                        <option value="constant">constant</option>
                      </select>
                      <input
                        type="text"
                        value={attribute.defaultValue}
                        disabled={
                          attribute.defaultType !== "none" ? false : true
                        }
                        onChange={(e) => {
                          handleDiagramAttributeChange(
                            selectedNode.id,
                            attribute.id,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            e.target.value,
                            undefined,
                            undefined,
                            undefined,
                            undefined
                          );
                        }}
                      />
                    </div>
                    <div className="attribute-elem project-attribute-constraints">
                      <div className="attribute-constraints">
                        {attribute.primaryKey && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(255,215,0,.5)" }}
                          >
                            Primary key
                            <div className="removeConstraint"></div>
                          </div>
                        )}
                        {attribute.foreignKey && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(255,228,225,.5)" }}
                          >
                            Foreign Key
                            <div
                              className="removeConstraint"
                              onClick={(e) => {
                                handleDiagramAttributeChange(
                                  selectedNode.id,
                                  attribute.id,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  false,
                                  undefined
                                );
                              }}
                            ></div>
                          </div>
                        )}
                        {attribute.unique && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(30,144,255,.5)" }}
                          >
                            Unique
                            <div
                              className="removeConstraint"
                              onClick={(e) => {
                                handleDiagramAttributeChange(
                                  selectedNode.id,
                                  attribute.id,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  false
                                );
                              }}
                            ></div>
                          </div>
                        )}
                        {attribute.notNull && (
                          <div
                            className="constraint"
                            style={{ background: "rgba(50,205,50,.5)" }}
                          >
                            Not null
                            <div
                              className="removeConstraint"
                              onClick={(e) => {
                                handleDiagramAttributeChange(
                                  selectedNode.id,
                                  attribute.id,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  undefined,
                                  false,
                                  undefined,
                                  undefined
                                );
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-bordered"
                        onClick={(e) => {
                          handleOpenContextMenu(attribute.id);
                        }}
                      >
                        <img src={icon_plus} alt="icon_plus" />
                      </button>
                      {isAttributeContexMenuOpen &&
                        contextAttributeId === attribute.id && (
                          <ul className="attribute-context-menu">
                            <li>
                              <button
                                onClick={(e) => {
                                  handleDiagramAttributeChange(
                                    selectedNode.id,
                                    attribute.id,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    true,
                                    undefined
                                  );
                                }}
                              >
                                <KeyIcon
                                  width={18}
                                  height={18}
                                  color={"black"}
                                />
                                <p>Primary key</p>
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  handleDiagramAttributeChange(
                                    selectedNode.id,
                                    attribute.id,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    true
                                  );
                                }}
                              >
                                <UniqueIcon
                                  width={18}
                                  height={18}
                                  color={"black"}
                                />
                                <p>Unique</p>
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={(e) => {
                                  handleDiagramAttributeChange(
                                    selectedNode.id,
                                    attribute.id,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    undefined,
                                    true,
                                    undefined,
                                    undefined
                                  );
                                }}
                              >
                                <NotNullIcon
                                  width={18}
                                  height={18}
                                  color={"black"}
                                />
                                <p>Not Null</p>
                              </button>
                            </li>
                          </ul>
                        )}
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
