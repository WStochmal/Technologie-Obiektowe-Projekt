// libraries
import React, { useState } from "react";
import { useEditorContext } from "../hooks/useEditorContext";

// styles
import "../styles/asideMenu.css";

// icons

import icon_diagram from "../assets/icons/diagram.png";

const AsideMenu = () => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const { data, setData } = useEditorContext();

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
                    <p>{node.data.label}</p>
                    <div>
                      <input
                        type="color"
                        value={node.data.color}
                        onChange={(e) => {
                          handleDiagramChangeColor(node.id, e.target.value);
                        }}
                      />
                      <button onClick={() => handleNodeClick(node.id)}>
                        {isNodeSelected ? "Close" : "Open"}
                      </button>
                    </div>
                  </div>
                  <div className="diagramListBody">
                    <ul>
                      {isNodeSelected &&
                        node.data.attributes.map((attribute, attributeIdx) => (
                          <li key={attributeIdx}>{attribute.label}</li>
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
              return (
                <div key={memberIdx} className="memberElement">
                  <div className="diagramListHeader">
                    <p>{member.firstname}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
};

export default AsideMenu;
