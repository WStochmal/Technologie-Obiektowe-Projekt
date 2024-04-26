// libraries
import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const register = async (firstname, lastname, username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://10.5.5.215:8000/", {
        firstname,
        lastname,
        username,
        password,
      });
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Request failed:", error.message);
      if (error.response) {
        setError(error.response.data.error);
      }
    }
  };

  return { register, error, isLoading };
};
