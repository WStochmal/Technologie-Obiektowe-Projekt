// libraries
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// styles
import "../../styles/auth.css";

// icons
import icon_user from "../../assets/icons/user.png";
import icon_password from "../../assets/icons/password.png";

// hooks
import { useLogin } from "../../hooks/useLogin";
import SpinnerLoader from "../../components/spinner-loader/Spinner-loader";

const SigninPage = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, isLogged } = useLogin();
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(auth.email, auth.password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuth({ ...auth, [name]: value });
  };

  return (
    <div className="content contentFlex">
      <form>
        <h1>Sign in</h1>
        <span className="inputContainer">
          <img src={icon_user} alt="icon_user" />
          <input
            name="email"
            type={"text"}
            className="input"
            value={auth.email}
            onChange={handleInputChange}
          />{" "}
        </span>
        <span className="inputContainer">
          <img src={icon_password} alt="icon_password" />
          <input
            name="password"
            type={"password"}
            className="input"
            value={auth.password}
            onChange={handleInputChange}
          />{" "}
        </span>
        <span className="inputContainer">
          <button
            onClick={handleSubmit}
            className="formSubmitBtn"
            style={{
              background: error
                ? "var(--color_red)"
                : isLogged
                ? "var(--color_green)"
                : "var(--color_blue)",
            }}
          >
            {isLoading && !error && !isLogged && (
              <SpinnerLoader
                size={10}
                borderSize={2}
                color={"var(--color_white)"}
              />
            )}
            {isLoading && !error
              ? "Signing in..."
              : error
              ? "Authorization rejected"
              : isLogged
              ? "Success! Redirecting..."
              : "Sign in"}
          </button>
        </span>
        {error && (
          <span className="inputContainer">
            <p className="redText">{error}</p>
          </span>
        )}
        <span className="inputContainer">
          <p className="greyText">
            Don't have an account?{" "}
            <a
              className="hightlightText"
              onClick={() => {
                navigate("/auth/sign-up");
              }}
            >
              Sign up
            </a>
          </p>
        </span>
      </form>{" "}
    </div>
  );
};

export default SigninPage;
