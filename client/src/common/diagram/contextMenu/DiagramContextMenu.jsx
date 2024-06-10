//libraries
import { useEffect, useRef } from "react";
// styles
import "./style.css";
// icons
import icon_go_to from "../../../assets/icons/go_to.png";
import icon_add_user from "../../../assets/icons/add_user.png";

import icon_download from "../../../assets/icons/download.png";
import icon_edit from "../../../assets/icons/edit.png";
import icon_copy from "../../../assets/icons/copy.png";
import icon_favourite from "../../../assets/icons/star.png";
import icon_info from "../../../assets/icons/info.png";
import icon_delete from "../../../assets/icons/delete.png";
import icon_json from "../../../assets/icons/json.png";
import icon_sql from "../../../assets/icons/sql.png";
import icon_pdf from "../../../assets/icons/pdf.png";
import icon_png from "../../../assets/icons/image.png";
// utils
import { DeleteDiagramFunction } from "../../../utils/diagram/deleteDiagramFunction";
// hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useToastContext } from "../../../hooks/useToastContext";
import { useEditorContext } from "../../../hooks/useEditorContext";

const DiagramContextMenu = ({ diagramId, onClose }) => {
  const menuRef = useRef(null);
  const { user } = useAuthContext();
  const { addToast } = useToastContext();
  const { setData } = useEditorContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleDeleteDiagram = async (e) => {
    e.stopPropagation();
    const response = await DeleteDiagramFunction(diagramId, user.token);
    if (response) {
      addToast("Diagram has been deleted", "success");
      setData((prevData) =>
        prevData.filter((diagram) => diagram.id !== diagramId)
      );
    } else {
      alert("Error deleting diagram");
    }
  };
  return (
    <ul className="diagramContextMenu" ref={menuRef}>
      <li className="borderBottom">
        <button>
          <img src={icon_go_to} alt="icon_go_to" />
          <p>Move to editor</p>
        </button>
      </li>
      <li className="downloadLi">
        <button>
          <img src={icon_download} alt="icon_download" />
          <p>Download</p>
        </button>
        <ul className="downloadOptions">
          <li>
            {" "}
            <button>
              <img src={icon_json} alt="icon_json" />
              <p>JSON</p>
            </button>
          </li>
          <li>
            {" "}
            <button>
              <img src={icon_sql} alt="icon_sql" />
              <p>SQL</p>
            </button>
          </li>
          <li>
            {" "}
            <button>
              <img src={icon_pdf} alt="icon_pdf" />
              <p>PDF</p>
            </button>
          </li>
          <li>
            {" "}
            <button>
              <img src={icon_png} alt="icon_png" />
              <p>PNG</p>
            </button>
          </li>
        </ul>
      </li>
      <li>
        <button>
          <img src={icon_edit} alt="icon_edit" />
          <p>Change filename</p>
        </button>
      </li>
      <li>
        <button>
          <img src={icon_copy} alt="icon_copy" />
          <p>Create copy</p>
        </button>
      </li>
      <li>
        <button>
          <img src={icon_favourite} alt="icon_favourite" />
          <p>Add file to favourites</p>
        </button>
      </li>
      <li className="borderBottom">
        <button>
          <img src={icon_add_user} alt="icon_add_user" />
          <p>Share</p>
        </button>
      </li>
      <li>
        <button>
          <img src={icon_info} alt="icon_info" />
          <p>File information</p>
        </button>
      </li>

      <li>
        <button onClick={handleDeleteDiagram}>
          <img src={icon_delete} alt="icon_delete" />
          <p>Delete file</p>
        </button>
      </li>
    </ul>
  );
};

export default DiagramContextMenu;
