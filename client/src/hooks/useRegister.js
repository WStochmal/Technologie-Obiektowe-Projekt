// libraries
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isSignedUp, setIsSignedUp] = useState();
  const register = async (firstname, lastname, email, password, image) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/user/register",
        {
          firstname,
          lastname,
          email,
          password,
          image,
        }
      );
      setIsLoading(false);
      setTimeout(() => {
        navigate("/auth/sign-in");
        setIsSignedUp(false);
      }, 250);
    } catch (error) {
      console.error("Request failed:", error.message);
      if (error.response) {
        setError(error.response.data.error);
      }
    }
  };

  return { register, error, isLoading, isSignedUp };
};
