// libraries
import { useState } from "react";

// icons

import icon_generate from "../../assets/icons/generate.png";

import icon_sql from "../../assets/icons/sql.png";

const HeaderGenerate = () => {
  const [isModalMenu, setIsShareModalMenu] = useState(false);

  return (
    <div className="buttonContainer">
      <button
        className="defaultBtn generateBtn"
        onClick={() => {
          setIsShareModalMenu(!isModalMenu);
        }}
      >
        {" "}
        <img src={icon_generate} alt="icon_generate" className="headerIcon" />
        <p>Generate</p>
      </button>{" "}
      {isModalMenu && (
        <div className="modalMenu">
          <button className="defaultBtn">
            {" "}
            <img src={icon_sql} alt="icon_json" className="headerIcon" />{" "}
            <p>SQL</p>
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default HeaderGenerate;
