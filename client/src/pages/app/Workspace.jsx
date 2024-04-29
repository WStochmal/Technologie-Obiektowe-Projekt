import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

import "../../styles/workspace.css";
import { useNavigate } from "react-router-dom";

const WorkspacePage = () => {
  const [diagrams, setDiagrams] = useState([]);
  const { user } = useAuthContext();
  const naviagte = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user._id);
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/diagram/get_by_user",
        {
          id: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setDiagrams(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="content">
      <h1 className="header greyText">My diagrams</h1>
      <div className="diagramList">
        {diagrams &&
          diagrams.length > 0 &&
          diagrams.map((diagram) => {
            return (
              <div
                key={diagram._id}
                className="diagramItem"
                onClick={() => {
                  naviagte(`/editor/${diagram._id}`);
                }}
              >
                <p>{diagram.label}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default WorkspacePage;
