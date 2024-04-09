import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEditorContext } from "../hooks/useEditorContext";

// testowe dane
import defaultData from "../data/data";

// icons

import icon_project from "../assets/icons/diagram-project.png";
import icon_arrow from "../assets/icons/arrow.png";

const AppLayout = () => {
  const { data, setData } = useEditorContext();

  const [diagramList, setDiagramList] = useState(true);
  const [projectIdx, setProjectIdx] = useState();
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setData(defaultData);

    if (data && id) {
      const index = parseInt(
        data.findIndex((item) => item.id === parseInt(id))
      );
      if (id > 0) {
        setProjectIdx(index);
        console.log(data[index].nodes);
      }
    }
  }, [data, id]);

  const handleOpenProject = (id) => {
    navigate(`./editor/${id}`);
  };

  const handleDiagramListView = () => {
    setDiagramList(!diagramList);
  };
  return (
    <>
      <header></header>
      <section>
        <aside>
          <p className="header">My projects:</p>
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
                  <img alt="" src={icon_project} />
                  <p>{item.label}</p>
                </button>
              );
            })}
        </aside>
        <div id="editor">
          <Outlet />
        </div>
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
        /> */}
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
        </div> */}
      </section>
    </>
  );
};

export default AppLayout;
