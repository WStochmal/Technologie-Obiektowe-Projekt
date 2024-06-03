import React, { createContext, useState } from "react";
import ModalWindow from "../components/modals/ModalWindow";

export const ModalWindowContext = createContext();

export const ModalWindowContextProvider = ({ children }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalParams, setModalParams] = useState({});

  const openModal = (type, params = {}) => {
    setIsOpened(true);
    setModalType(type);
    setModalParams(params);
  };

  const closeModal = () => {
    setIsOpened(false);
    setModalType(null);
    setModalParams({});
  };

  return (
    <ModalWindowContext.Provider value={{ openModal, closeModal }}>
      {" "}
      {isOpened && modalType && (
        <ModalWindow type={modalType} params={modalParams} />
      )}{" "}
      {children}{" "}
    </ModalWindowContext.Provider>
  );
};
