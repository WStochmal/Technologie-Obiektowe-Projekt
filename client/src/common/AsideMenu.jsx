// libraries
import React, { useState } from "react";
import { useEditorContext } from "../hooks/useEditorContext";
import { v4 as uuidv4 } from "uuid";

// styles
import "../styles/asideMenu.css";

// icons

import icon_diagram from "../assets/icons/diagram.png";
import icon_delete from "../assets/icons/delete.png";

const AsideMenu = () => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const { data, setData, activeMembers } = useEditorContext();

  const [openedMenuElement, setOpenedMenuElement] = useState({
    body: false,
    members: false,
  });

  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
  };

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
  };

  const handleDiagramAttributeChange = (
    changeType,
    nodeId,
    attributeId,
    value
  ) => {
    console.log(changeType, nodeId, attributeId, value);
    if (changeType === "label") {
      setData((prevData) => {
        const newNodes = prevData.diagram.nodes.map((node) => {
          if (node.id === nodeId) {
            const newAttributes = node.data.attributes.map((attribute) => {
              if (attribute.id === attributeId) {
                return {
                  ...attribute,
                  label: value,
                };
              }
              return attribute;
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
    } else if (changeType === "type") {
      setData((prevData) => {
        const newNodes = prevData.diagram.nodes.map((node) => {
          if (node.id === nodeId) {
            const newAttributes = node.data.attributes.map((attribute) => {
              if (attribute.id === attributeId) {
                return {
                  ...attribute,
                  type: value,
                };
              }
              return attribute;
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
    }
  };

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
  };

  const handleDiagramAttributeAdd = (nodeId) => {
    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          const newAttributes = [
            ...node.data.attributes,
            {
              id: node.data.attributes.length + 1,
              label: "New Attribute",
              type: "INT",
            },
          ];
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

  const handleDiagramAdd = () => {
    setData((prevData) => {
      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: [
            ...prevData.diagram.nodes,
            {
              id: uuidv4(),
              data: {
                label: "New Node",
                color: "#06b",
                attributes: [],
              },
              position: {
                x: 100,
                y: 100,
              },
              type: "customNode",
            },
          ],
        },
      };
    });
  };

  const handleDiagramRemove = (nodeId) => {
    setData((prevData) => {
      return {
        ...prevData,
        diagram: {
          ...prevData.diagram,
          nodes: prevData.diagram.nodes.filter((node) => node.id !== nodeId),
        },
      };
    });
  };

  const handleDiagramLabelChange = (nodeId, value) => {
    setData((prevData) => {
      const newNodes = prevData.diagram.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: value,
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

  const MySQLDataTypesSelect = (defaultValue, nodeId, attributeId) => {
    // Lista typów danych MySQL
    const dataTypes = [
      "TINYINT",
      "SMALLINT",
      "MEDIUMINT",
      "INT",
      "BIGINT",
      "FLOAT",
      "DOUBLE",
      "DECIMAL",
      "DATE",
      "DATETIME",
      "TIMESTAMP",
      "TIME",
      "YEAR",
      "CHAR",
      "VARCHAR",
      "BINARY",
      "VARBINARY",
      "TINYBLOB",
      "BLOB",
      "MEDIUMBLOB",
      "LONGBLOB",
      "TINYTEXT",
      "TEXT",
      "MEDIUMTEXT",
      "LONGTEXT",
      "ENUM",
      "SET",
    ];

    return (
      <div>
        <select
          id="dataType"
          name="dataType"
          defaultValue={defaultValue}
          className="nodrag"
          onChange={(e) => {
            handleDiagramAttributeChange(
              "type",
              nodeId,
              attributeId,
              e.target.value
            );
          }}
        >
          {dataTypes.map((type, index) => (
            <option key={index} value={type}>
              {" "}
              {type}{" "}
            </option>
          ))}{" "}
        </select>{" "}
      </div>
    );
  };

  const toggleMenuPartBody = (part) => {
    switch (part) {
      case "body":
        setOpenedMenuElement({
          body: !openedMenuElement.body,
          members: openedMenuElement.members, // keep the state of the other part
        });
        break;
      case "members":
        setOpenedMenuElement({
          members: !openedMenuElement.members,
          body: openedMenuElement.body, // keep the state of the other part
        });
        break;
      default:
        break;
    }
  };

  return (
    <aside>
      <div className="asideHeader">
        <img src={icon_diagram} alt="icon_diagram" />
        <p className="subHeader">{data && data.label}</p>
      </div>

      <div className="menuPart">
        <div className="menuPartHeader">
          Diagram Body
          <button onClick={handleDiagramAdd}>ADD</button>
          <button onClick={() => toggleMenuPartBody("body")}>OTWIERANIE</button>
        </div>
        <div
          className={
            "menuPartBody" +
            " " +
            (openedMenuElement.body ? "menuPartBody_open" : "")
          }
        >
          {data &&
            data.diagram.nodes.map((node, nodeIdx) => {
              const isNodeSelected = selectedNodeId === node.id;
              return (
                <div
                  key={nodeIdx}
                  className="diagramElement"
                  style={{ borderLeft: `5px solid ${node.data.color}` }}
                >
                  <div className="diagramListHeader">
                    <input
                      type="text"
                      value={node.data.label}
                      onChange={(e) => {
                        handleDiagramLabelChange(node.id, e.target.value);
                      }}
                    />

                    <div>
                      <input
                        type="color"
                        value={node.data.color}
                        onChange={(e) => {
                          handleDiagramChangeColor(node.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => handleDiagramAttributeAdd(node.id)}
                      >
                        Add
                      </button>
                      <button onClick={() => handleNodeClick(node.id)}>
                        {isNodeSelected ? "Close" : "Open"}
                      </button>

                      <button
                        className="removeBtn"
                        onClick={() => handleDiagramRemove(node.id)}
                      >
                        <img src={icon_delete} alt="icon_delete" />
                      </button>
                    </div>
                  </div>
                  <div className="diagramListBody">
                    <ul>
                      {isNodeSelected &&
                        node.data.attributes.map((attribute, attributeIdx) => (
                          <li key={attributeIdx}>
                            <span>
                              <input
                                type="text"
                                value={attribute.label}
                                onChange={(e) => {
                                  handleDiagramAttributeChange(
                                    "label",
                                    node.id,
                                    attribute.id,
                                    e.target.value
                                  );
                                }}
                              />
                            </span>
                            <span>
                              {MySQLDataTypesSelect(
                                attribute.type,
                                node.id,
                                attribute.id
                              )}
                            </span>
                            <span>
                              <input type="text" />
                            </span>
                            <button
                              className="removeBtn"
                              onClick={() => {
                                handleDiagramAttributeRemove(
                                  node.id,
                                  attribute.id
                                );
                              }}
                            >
                              <img src={icon_delete} alt="icon_delete" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="menuPart">
        <div className="menuPartHeader">
          Members
          <button onClick={() => toggleMenuPartBody("members")}>ADD NEW</button>
          <button onClick={() => toggleMenuPartBody("members")}>
            OTWIERANIE
          </button>
        </div>
        <div
          className={
            "menuPartBody" +
            " " +
            (openedMenuElement.members ? "menuPartBody_open" : "")
          }
        >
          {data &&
            data.members.map((member, memberIdx) => {
              // Sprawdzamy, czy członek występuje w activeMembers
              const isActive = activeMembers.some(
                (activeMember) => activeMember._id === member._id
              );

              return (
                <div
                  key={memberIdx}
                  className={`memberElement ${isActive ? "active" : ""}`}
                >
                  <div className={`avatar ${isActive ? "active" : ""}`}>
                    <img src={member.image} alt="avatar" />
                  </div>
                  <p>
                    {member.firstname} {member.lastname}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
};

export default AsideMenu;
