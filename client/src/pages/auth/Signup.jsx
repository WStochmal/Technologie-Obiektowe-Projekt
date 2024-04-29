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
import { useRegister } from "../../hooks/useRegister";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, error, isLoading, isSignedUp } = useRegister();
  const [auth, setAuth] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    image: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(auth);
    register(
      auth.firstname,
      auth.lastname,
      auth.email,
      auth.password,
      auth.image
    );
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // console.log("Plik wybrany:", files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        // console.log("Dane w formie Base64:", event.target.result);
        setAuth({ ...auth, [name]: event.target.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setAuth({ ...auth, [name]: value });
    }
  };

  return (
    <div className="content">
      <form>
        <h1>Sign up</h1>
        <span className="inputContainer">
          <img src={icon_user} alt="icon_user" />
          <input
            name="firstname"
            placeholder="John.."
            type={"text"}
            className="input"
            value={auth.firstname}
            onChange={handleInputChange}
          />{" "}
        </span>
        <span className="inputContainer">
          <img src={icon_user} alt="icon_user" />
          <input
            name="lastname"
            placeholder="Smith.."
            type={"text"}
            className="input"
            value={auth.lastname}
            onChange={handleInputChange}
          />{" "}
        </span>
        <span className="inputContainer">
          <img src={icon_user} alt="icon_user" />
          <input
            name="email"
            placeholder="smith@example.com"
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
            placeholder="password.."
            type={"password"}
            className="input"
            value={auth.password}
            onChange={handleInputChange}
          />{" "}
        </span>
        <span className="inputContainer">
          <img src={icon_user} alt="icon_user" />
          <input
            name="image"
            placeholder="avatar image"
            type={"file"}
            className="input"
            // value={auth.image}
            onChange={handleInputChange}
          />{" "}
          <div className="avatar" style={{ minWidth: "30px" }}>
            <img src={auth.image} alt="avatar" />
          </div>
        </span>

        <span className="inputContainer">
          <button
            onClick={handleSubmit}
            className="formSubmitBtn"
            style={{
              background: error
                ? "var(--color_red)"
                : isSignedUp
                ? "var(--color_green)"
                : "var(--color_blue)",
            }}
          >
            {isLoading && !error && !isSignedUp && (
              <SpinnerLoader
                size={10}
                borderSize={2}
                color={"var(--color_white)"}
              />
            )}
            {isLoading && !error ? "Signing up..." : "Sign up"}
          </button>
        </span>
        {error && (
          <span className="inputContainer">
            <p className="redText">{error}</p>
          </span>
        )}
      </form>{" "}
    </div>
  );
};

export default SignupPage;
