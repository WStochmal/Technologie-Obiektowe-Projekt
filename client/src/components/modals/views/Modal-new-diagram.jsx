// library
import { useState } from "react";
import axios from "axios";

// hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useToastContext } from "../../../hooks/useToastContext";
import { useEditorContext } from "../../../hooks/useEditorContext";

const ModalNewDiagram = ({ params }) => {
  const [diagramTitle, setDiagramTitle] = useState("");
  const { user } = useAuthContext();
  const { addToast } = useToastContext();
  const { setDiagrams } = useEditorContext();

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
      if (response.status === 200) {
        addToast("Diagram has been created", "success");
        setDiagrams((prevData) => [...prevData, response.data]);
      } else {
        addToast("Error creating diagram", "error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Add new diagram</h1>

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
