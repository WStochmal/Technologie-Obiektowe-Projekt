// libraries
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const { dispatch } = useAuthContext();
  const [isLogged, setIsLogged] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(false);

    console.log(process.env.REACT_APP_PROXY || "Proxy not set");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/user/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsLoading(false);
      dispatch({ type: "LOGIN", payload: response.data });

      setIsLogged(true);

      setTimeout(() => {
        setIsLogged(false);
        navigate("/workspace");
      }, 250);
    } catch (error) {
      console.error("Request failed:", error.message);

      if (error.response) {
        if (error.response.data.error === "Unauthorized") {
          setError("Invalid email or password.");
        } else {
          setError(error.response.data.error);
        }
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return { login, error, isLoading, isLogged };
};
