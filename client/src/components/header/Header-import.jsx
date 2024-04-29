// libraries
import { useState } from "react";

// icons

import icon_import from "../../assets/icons/import.png";
import icon_json from "../../assets/icons/json.png";
import icon_pdf from "../../assets/icons/pdf.png";
import icon_sql from "../../assets/icons/sql.png";
import icon_image from "../../assets/icons/image.png";

const HeaderImport = () => {
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
        <img src={icon_import} alt="icon_export" className="headerIcon" />
        <p>Import</p>
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
        </div>
      )}{" "}
    </div>
  );
};
export default HeaderImport;
