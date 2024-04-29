// libraries
import { useState } from "react";

// icons

import icon_export from "../../assets/icons/export.png";
import icon_json from "../../assets/icons/json.png";
import icon_pdf from "../../assets/icons/pdf.png";
import icon_sql from "../../assets/icons/sql.png";
import icon_image from "../../assets/icons/image.png";

const HeaderExport = () => {
  const [isModalMenu, setIsShareModalMenu] = useState(false);

  return (
    <div className="buttonContainer">
      <button
        className="defaultBtn"
        onClick={() => {
          setIsShareModalMenu(!isModalMenu);
        }}
      >
        {" "}
        <img src={icon_export} alt="icon_export" className="headerIcon" />
        <p>Export</p>
      </button>{" "}
      {isModalMenu && (
        <div className="modalMenu">
          <button className="defaultBtn">
            {" "}
            <img src={icon_json} alt="icon_json" className="headerIcon" />{" "}
            <p>JSON</p>
          </button>{" "}
          <button className="defaultBtn">
            {" "}
            <img src={icon_sql} alt="icon_sql" className="headerIcon" />{" "}
            <p>SQL</p>
          </button>{" "}
          <button className="defaultBtn">
            {" "}
            <img src={icon_pdf} alt="icon_pdf" className="headerIcon" />{" "}
            <p>PDF</p>
          </button>{" "}
          <button className="defaultBtn">
            {" "}
            <img
              src={icon_image}
              alt="icon_image"
              className="headerIcon"
            />{" "}
            <p>PNG</p>
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default HeaderExport;
