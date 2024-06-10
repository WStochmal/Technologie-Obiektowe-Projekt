// libraries
import { useEffect, useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";

// styles
import "../../styles/workspace.css";

// hooks
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useModalWindowContext } from "../../hooks/useModalWindowContext";

// utils
import { formatDateString } from "../../utils/functions";

// context
import { EditorContextProvider } from "../../context/EditorContext";
import { ControlContextProvider } from "../../context/ControlContext";

// components
import DiagramScreenshot from "../../components/editor/diagramScreenshot/DiagramScreenshot";

// icons
import icon_delete from "../../assets/icons/delete.png";
import icon_arrow from "../../assets/icons/arrow.png";
import icon_more from "../../assets/icons/more.png";
import icon_diagram from "../../assets/icons/diagram.png";
import DiagramContextMenu from "../../common/diagram/contextMenu/DiagramContextMenu";
import { useEditorContext } from "../../hooks/useEditorContext";

const WorkspacePage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { openModal } = useModalWindowContext();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [diagramId, setDiagramId] = useState(null);
  const { diagrams, setDiagrams } = useEditorContext();
  const [viewType, setViewType] = useState("Gallery");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleOpenContextMenu = (diagramId) => {
    console.log("handleOpenContextMenu", diagramId);
    setIsContextMenuOpen(true);
    setDiagramId(diagramId);
  };
  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
    setDiagramId(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/diagram/get_by_user",
        {
          id: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDiagrams(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDiagram = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/diagram/delete_diagram/${id}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewDiagram = async () => {
    openModal("NewDiagramModal", {});
  };

  const handleChangeView = (type) => {
    switch (type) {
      case "list":
        setViewType("List");
        break;
      case "gallery":
        setViewType("Gallery");
        break;
      default:
        setViewType("Gallery");
        break;
    }
  };

  return (
    <div className="content">
      <div className="diagramListHeader">
        <button className="defaultBtn" onClick={createNewDiagram}>
          Create
        </button>
        <button
          onClick={() => {
            handleChangeView("list");
          }}
        >
          Lista
        </button>
        <button
          onClick={() => {
            handleChangeView("gallery");
          }}
        >
          Galeria
        </button>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      <h1 className="header greyText">My diagrams</h1>

      <div className={"diagram" + viewType}>
        {diagrams
          .filter((diagram) =>
            diagram.label.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((diagram) => (
            <div
              key={diagram._id}
              className="diagramItem"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/editor/${diagram._id}`);
              }}
            >
              <div className="diagramHeader">
                <span>
                  <div className="diagramIconBg">
                    <img src={icon_diagram} alt="icon_diagram" />
                  </div>
                  <p>{diagram.label}</p>
                </span>
                <span>
                  <button
                    className="diagramMore"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenContextMenu(diagram._id);
                    }}
                  >
                    <img src={icon_more} alt="icon_more" />
                  </button>
                </span>
                {isContextMenuOpen && diagramId === diagram._id && (
                  <DiagramContextMenu
                    diagramId={diagramId}
                    onClose={closeContextMenu}
                  />
                )}
              </div>
              <div className="diagramPreview">
                {diagrams && <Preview diagram={diagram} />}
              </div>
              <div className="diagramInfo">
                {diagram &&
                  diagram.members.map((member) => {
                    if (member.type === "owner") {
                      return (
                        <div key={member.userId} className="avatar">
                          <img
                            src={member.image}
                            alt={`${member.firstname} ${member.lastname}`}
                          />
                        </div>
                      );
                    }
                  })}
                <div className="diagramDate">
                  <div className="greyBall"></div>
                  <p className="greyText">
                    {formatDateString(diagram.createdAt, false)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const Preview = ({ diagram }) => {
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const generateAndSetPreview = async () => {
      const img = await generatePreview(diagram);
      setPreviewImg(img);
    };

    generateAndSetPreview();
  }, [diagram]);

  return previewImg ? <img src={previewImg.src} alt="Diagram Preview" /> : null;
};

const generatePreview = async (diagram) => {
  try {
    // Tworzymy niewidoczny kontener
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "auto";
    container.style.position = "absolute";
    container.style.left = "-10000px"; // Przesuwamy poza obszar widoczności
    document.body.appendChild(container);

    // Renderujemy DiagramScreenshot w kontenerze
    ReactDOM.render(
      <EditorContextProvider>
        <ControlContextProvider>
          <DiagramScreenshot
            data={diagram}
            params={{ width: "auto", type: "PNG" }}
          />
        </ControlContextProvider>
      </EditorContextProvider>,
      container
    );

    // Czekamy na pełne renderowanie komponentu
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Przechwytujemy obraz przy użyciu html2canvas
    const canvas = await html2canvas(container);

    // Usuwamy kontener
    container.parentNode.removeChild(container);

    // Tworzymy img element z wygenerowanym obrazem
    const img = new Image();
    img.src = canvas.toDataURL("image/png");

    return img;
  } catch (error) {
    console.error("Error generating screenshot:", error);
    throw error;
  }
};

export default WorkspacePage;
