import axios from "axios";

async function DeleteDiagramFunction(id, token) {
  try {
    const response = await axios.delete(
      `http://127.0.0.1:5000/api/diagram/delete_diagram/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { DeleteDiagramFunction };
