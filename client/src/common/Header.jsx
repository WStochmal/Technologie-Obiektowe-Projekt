// libraries
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import icon_moon from "../assets/icons/moon.png";

// components
import HeaderExport from "../components/header/Header-export";
import HeaderImport from "../components/header/Header-import";
import HeaderGenerate from "../components/header/Header-generate";

// hooks
import { useLogout } from "../hooks/useLogout";
import { useThemeContext } from "../hooks/useThemeContext";

const Header = ({ isOpen = false, onClick }) => {
  const [isEditor, setIsEditor] = useState(false);
  const [isProfileModalMenu, setIsProfileModalMenu] = useState(false);
  const [isExportModalMenu, setIsExportModalMenu] = useState(false);
  const [isGenerateModalMenu, setIsGenerateModalMenu] = useState(false);
  const [isShareModalMenu, setIsShareModalMenu] = useState(false);
  const { theme, toggleTheme } = useThemeContext();

  const { user } = useAuthContext();

  const { logout } = useLogout();
  const { data, setData, activeMembers } = useEditorContext();
  const navigate = useNavigate();

  function isEditorUrl() {
    const currentUrl = window.location.href;
    return currentUrl.includes("/editor/");
  }

  useEffect(() => {
    if (isEditorUrl()) {
      setIsEditor(true);
    } else {
      setIsEditor(false);
    }
  }, [window.location.href]);
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
                <HeaderImport />
                <HeaderExport />
                <HeaderGenerate />
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
                        <img
                          src={user.image}
                          alt="avatar"
                          className="avatarImg"
                        />
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
                navigate("/auth/sign-in");
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
                  <img src={user.image} alt="avatar" className="avatarImg" />
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
                  <button className="defaultBtn" onClick={toggleTheme}>
                    {" "}
                    <img
                      src={icon_moon}
                      alt="icon_moon"
                      className="headerIcon"
                    />{" "}
                    <p>Dark theme</p>
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
