// libraries
import { useEffect, useState } from "react";
// styles

import "./style.css";

// icons

import icon_close from "../../assets/icons/close.png";

// components

import ModalNewConnection from "./views/Modal-new-connection";
import { useModalWindowContext } from "../../hooks/useModalWindowContext";
import ModalGenerate from "./views/Modal-generate";
import ModalNewDiagram from "./views/Modal-new-diagram";

const ModalWindow = ({ type, params }) => {
  const [modalTitle, setModalTitle] = useState("");
  const [modalSize, setModalSize] = useState();
  const [modalContent, setModalContent] = useState();

  const { closeModal } = useModalWindowContext();

  useEffect(() => {
    switch (type) {
      case "ConnectionModal":
        setModalTitle("Connection");
        setModalSize({ width: "400px" });
        setModalContent(<ModalNewConnection params={params} />);
        break;
      case "GenerateModal":
        setModalTitle("Generate");
        setModalSize({ width: "800px" });
        setModalContent(<ModalGenerate params={params} />);
        break;

      case "NewDiagramModal":
        setModalTitle("New Diagram");
        setModalSize({ width: "400px" });
        setModalContent(<ModalNewDiagram params={params} />);
        break;
      default:
        break;
    }
  }, []);

  const handleClose = () => {
    console.log("close");
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window" style={modalSize && modalSize}>
        <div className="modal-header" onClick={handleClose}>
          <p> {modalTitle && modalTitle} </p>{" "}
          <button className="defaultBtn">
            {" "}
            <img
              src={icon_close}
              alt="icon_close"
              className="headerIcon"
            />{" "}
          </button>{" "}
        </div>{" "}
        <div className="modal-body"> {modalContent && modalContent} </div>{" "}
      </div>{" "}
    </div>
  );
};

export default ModalWindow;
