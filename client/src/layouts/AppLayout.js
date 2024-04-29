// libraries
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

// styles
import "../styles/header.css";
import { useAuthContext } from "../hooks/useAuthContext";
import Header from "../common/Header";
import AsideMenu from "../common/AsideMenu";

const AppLayout = () => {
  const [diagramList, setDiagramList] = useState(true);

  const [isAsideMenuOpen, setIsAsideMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenProject = (id) => {
    navigate(`./editor/${id}`);
  };

  const handleDiagramListView = () => {
    setDiagramList(!diagramList);
  };

  const handleAside = () => {
    console.log("aside");

    setIsAsideMenuOpen(!isAsideMenuOpen);
  };
  return (
    <>
      <Header isOpen={isAsideMenuOpen} onClick={handleAside} />{" "}
      <section>
        {" "}
        {isAsideMenuOpen && <AsideMenu />}{" "}
        <div id="editor">
          <Outlet />
        </div>{" "}
      </section>{" "}
    </>
  );
};

export default AppLayout;
