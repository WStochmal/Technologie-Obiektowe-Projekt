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

const WorkspacePage = () => {
  const [diagrams, setDiagrams] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { openModal } = useModalWindowContext();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

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

  return (
    <div className="content">
      <div className="diagramListHeader">
        <button className="defaultBtn" onClick={createNewDiagram}>
          Create
        </button>
      </div>
      <h1 className="header greyText">My diagrams</h1>
      <div className="diagramList">
        {diagrams.map((diagram) => (
          <div key={diagram._id} className="diagramItem">
            <div className="diagramPreview">
              {diagrams && <Preview diagram={diagram} />}
            </div>
            <div className="diagramInfo">
              <p>{diagram.label}</p>
              <p className="greyText">
                {formatDateString(diagram.createdAt, true)}
              </p>
              <div className="diagramActions">
                <button
                  className="removeBtn"
                  onClick={() => {
                    deleteDiagram(diagram._id);
                  }}
                >
                  <img src={icon_delete} alt="icon_delete" />
                </button>
                <button
                  className="removeBtn"
                  onClick={() => {
                    navigate(`/editor/${diagram._id}`);
                  }}
                >
                  <img src={icon_arrow} alt="icon_arrow" />
                </button>
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
