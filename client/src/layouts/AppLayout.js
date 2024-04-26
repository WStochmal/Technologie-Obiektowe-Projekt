// libraries
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

// icons
import icon_project from "../assets/icons/diagram-project.png";
import icon_arrow from "../assets/icons/arrow.png";
import icon_menu from "../assets/icons/menu.png";

// styles
import "../styles/header.css";
import { useAuthContext } from "../hooks/useAuthContext";

const AppLayout = () => {
  const [diagramList, setDiagramList] = useState(true);
  const [projectIdx, setProjectIdx] = useState();
  const { id } = useParams();

  const [data, setData] = useState();

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const handleOpenProject = (id) => {
    navigate(`./editor/${id}`);
  };

  const handleDiagramListView = () => {
    setDiagramList(!diagramList);
  };
  return (
    <>
      <header>
        <span>
          <button className="menu">
            {" "}
            <img src={icon_menu} alt="icon_menu" />{" "}
          </button>{" "}
        </span>{" "}
        {user && (
          <span>
            <img src={user.image} alt="avatar" />
          </span>
        )}{" "}
      </header>{" "}
      <section>
        <aside>
          <p className="header"> My projects: </p>{" "}
          {data &&
            data.map((item, itemIdx) => {
              return (
                <button
                  className="menuItem"
                  key={itemIdx}
                  onClick={() => {
                    handleOpenProject(item.id);
                  }}
                >
                  <img alt="" src={icon_project} /> <p> {item.label} </p>{" "}
                </button>
              );
            })}{" "}
        </aside>{" "}
        <div id="editor">
          <Outlet />
        </div>{" "}
        {/* <img
                                                                      alt=""
                                                                      src={icon_arrow}
                                                                      id="diagramListBtn"
                                                                      onClick={handleDiagramListView}
                                                                      style={{
                                                                        right: diagramList === true ? "calc(300px + 1rem)" : "1rem",
                                                                        transform:
                                                                          diagramList === true ? "rotateZ(180deg)" : "rotateZ(0deg)",
                                                                      }}
                                                                    /> */}{" "}
        {/* <div
                                                                      id="diagramsList"
                                                                      style={{
                                                                        width: diagramList === true ? "300px" : "0px",
                                                                        minWidth: diagramList === true ? "300px" : "0px",
                                                                      }}
                                                                    >
                                                                      <p className="header">Diagrams list:</p>
                                                                      {data &&
                                                                        projectIdx !== undefined &&
                                                                        data[projectIdx].nodes.map((item, itemIdx) => {
                                                                          return <p key={itemIdx}>{item.data.label}</p>;
                                                                        })}
                                                                    </div> */}{" "}
      </section>{" "}
    </>
  );
};

export default AppLayout;
