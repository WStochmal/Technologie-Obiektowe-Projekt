// library
import { useState } from "react";
import axios from "axios";

// hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
const ModalNewDiagram = ({ params }) => {
  const [diagramTitle, setDiagramTitle] = useState("");
  const { user } = useAuthContext();

  const handleAddNewDiagram = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/diagram/create_diagram`,
        {
          user_id: user._id,
          title: diagramTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Dodawanie nowego diagramu</h1>
      <input
        type="text"
        placeholder="Diagram title"
        onChange={(e) => setDiagramTitle(e.target.value)}
      />
      <button onClick={handleAddNewDiagram}>Add</button>
    </>
  );
};
export default ModalNewDiagram;
