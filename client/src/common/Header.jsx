import { useState } from "react";

import { useAuthContext } from "../hooks/useAuthContext";
import { useEditorContext } from "../hooks/useEditorContext";

// icons
import icon_menu from "../assets/icons/menu.png";
import icon_arrow from "../assets/icons/arrow.png";
import icon_export from "../assets/icons/export.png";
import icon_share from "../assets/icons/share.png";
import icon_generate from "../assets/icons/generate.png";

import icon_user from "../assets/icons/user.png";
import icon_logout from "../assets/icons/logout.png";
import icon_diagram from "../assets/icons/diagram.png";
import icon_close from "../assets/icons/close.png";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const Header = ({ isOpen = false, onClick }) => {
  const [isEditor, setIsEditor] = useState(true);
  const [isProfileModalMenu, setIsProfileModalMenu] = useState(false);

  const { user } = useAuthContext();

  const { logout } = useLogout();
  const { data, setData, activeMembers } = useEditorContext();
  const navigate = useNavigate();
  return (
    <header>
      <div className="headerPart">
        {user && (
          <>
            <span>
              <button className="defaultBtn" onClick={onClick}>
                {" "}
                <img
                  src={!isOpen ? icon_menu : icon_close}
                  alt="icon_menu"
                  className="headerIcon"
                />{" "}
              </button>{" "}
            </span>{" "}
            {isEditor && (
              <span style={{ paddingRight: "0.25rem" }}>
                {" "}
                <button
                  className="defaultBtn"
                  onClick={() => {
                    navigate("/workspace");
                  }}
                >
                  {" "}
                  <img
                    src={icon_arrow}
                    alt="icon_arrow"
                    className="headerIcon"
                  />{" "}
                </button>{" "}
                <p
                  style={{
                    borderLeft: "1px solid var(--color_grey)",
                    paddingLeft: "1rem",
                    paddingRight: "1.5rem",
                  }}
                >
                  {data && data.label}
                </p>{" "}
                <button className="defaultBtn">
                  {" "}
                  <img
                    src={icon_export}
                    alt="icon_export"
                    className="headerIcon"
                  />
                  <p>Export</p>
                </button>{" "}
                <button className="defaultBtn generateBtn">
                  {" "}
                  <img
                    src={icon_generate}
                    alt="icon_generate"
                    className="headerIcon"
                  />
                  <p>Generate</p>
                </button>{" "}
                <p
                  style={{
                    borderLeft: "1px solid var(--color_grey)",
                    marginLeft: "1rem",
                    paddingRight: "0.5rem",
                  }}
                >
                  &nbsp;
                </p>
                <button className="defaultBtn">
                  {" "}
                  <img
                    src={icon_share}
                    alt="icon_share"
                    className="headerIcon"
                  />{" "}
                  <p>Share</p>
                </button>{" "}
                <div className="avatarList">
                  {activeMembers &&
                    activeMembers.slice(0, 3).map((user, userIdx) => (
                      <div className="avatar" key={userIdx}>
                        <img src={user.image} alt="avatar" />
                      </div>
                    ))}
                  {activeMembers && activeMembers.length > 3 && (
                    <div className="avatar avatarOverflow" key="overflow">
                      <img src={icon_user} alt="avatar" />
                      <p>+{activeMembers.length - 3}</p>
                    </div>
                  )}
                </div>
              </span>
            )}{" "}
          </>
        )}
      </div>
      <div className="headerPart">
        {" "}
        {!user && (
          <span>
            <button
              className="defaultBtn"
              onClick={() => {
                navigate("/auth/sing-in");
              }}
            >
              {" "}
              <img
                src={icon_user}
                alt="icon_user"
                className="headerIcon"
              />{" "}
              <p>Sign in</p>
            </button>
          </span>
        )}
        <span>
          {user && (
            <>
              <button
                className="defaultBtn"
                onClick={() => {
                  setIsProfileModalMenu(!isProfileModalMenu);
                }}
              >
                <div className="avatar">
                  <img src={user.image} alt="avatar" />
                </div>{" "}
                <p> {user.firstname} </p>{" "}
              </button>{" "}
              {isProfileModalMenu && (
                <div className="profileModalMenu">
                  <button className="defaultBtn">
                    {" "}
                    <img
                      src={icon_user}
                      alt="icon_user"
                      className="headerIcon"
                    />{" "}
                    <p>My profile</p>
                  </button>{" "}
                  <button className="defaultBtn">
                    {" "}
                    <img
                      src={icon_diagram}
                      alt="icon_diagram"
                      className="headerIcon"
                    />{" "}
                    <p>My diagrams</p>
                  </button>{" "}
                  <button className="defaultBtn" onClick={logout}>
                    {" "}
                    <img
                      src={icon_logout}
                      alt="icon_logout"
                      className="headerIcon"
                    />{" "}
                    <p>Logout</p>
                  </button>{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
        </span>
      </div>{" "}
    </header>
  );
};

export default Header;
