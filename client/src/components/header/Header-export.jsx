// libraries
import { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { toPng } from "html-to-image";

// icons
import icon_export from "../../assets/icons/export.png";
import icon_json from "../../assets/icons/json.png";
import icon_pdf from "../../assets/icons/pdf.png";
import icon_sql from "../../assets/icons/sql.png";
import icon_image from "../../assets/icons/image.png";

// hooks
import { useEditorContext } from "../../hooks/useEditorContext";

//components
import DiagramScreenshot from "../editor/diagramScreenshot/DiagramScreenshot";
import { ControlContextProvider } from "../../context/ControlContext";
import { EditorContextProvider } from "../../context/EditorContext";

const HeaderExport = () => {
  const [isModalMenu, setIsShareModalMenu] = useState(false);

  const { data } = useEditorContext();

  const generateSQL = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/diagram/generate-sql",
        {
          diagram: data.diagram,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      const url = window.URL.createObjectURL(
        new Blob([response.data.sql_code])
      );

      // Tworzymy link do pobrania pliku
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "diagram.sql");
      document.body.appendChild(link);

      // Klikamy w link, aby zainicjować pobieranie pliku
      link.click();

      // Czyszczymy obiekt URL po pobraniu pliku
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
    }
  };
  // Generating JSON file
  // const generateJSON = async () => {
  //   const jsonData = JSON.stringify(data.diagram);
  //   const url = window.URL.createObjectURL(new Blob([jsonData]));

  //   // Tworzymy link do pobrania pliku
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "diagram.json");
  //   document.body.appendChild(link);

  //   // Klikamy w link, aby zainicjować pobieranie pliku
  //   link.click();

  //   // Czyszczymy obiekt URL po pobraniu pliku
  //   window.URL.revokeObjectURL(url);
  // };
  // // Generating PDF file
  // const generatePDF = async () => {
  //   // Tworzymy tymczasowy element div, który będzie renderował komponent DiagramScreenShot
  //   const tempDiv = document.createElement("div");
  //   tempDiv.style.cssText = "position: absolute; top: -9999px; left: -9999px;"; // Ukrywamy element poza obszarem widoczności
  //   document.body.appendChild(tempDiv); // Append the tempDiv synchronously

  //   // Renderujemy komponent DiagramScreenShot w utworzonym elemencie
  //   ReactDOM.render(
  //     <ControlContextProvider>
  //       <DiagramScreenshot data={data} />
  //     </ControlContextProvider>,
  //     tempDiv // Render into tempDiv
  //   );

  //   // Wait for the component to fully render
  //   await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the delay as needed

  //   // Wykonujemy zrzut ekranu komponentu DiagramScreenShot
  //   html2canvas(tempDiv).then((canvas) => {
  //     // Tworzymy obiekt obrazu z canvas
  //     const imgData = canvas.toDataURL("image/png");

  //     // Tworzymy obiekt jspdf
  //     const pdf = new jsPDF();

  //     // Dodajemy obraz do dokumentu PDF
  //     pdf.addImage(imgData, "PNG", 0, 0);

  //     // Zapisujemy plik PDF
  //     pdf.save("diagram.pdf");

  //     // Usuwamy tymczasowy element div z drzewa DOM
  //     document.body.removeChild(tempDiv);
  //   });
  // };

  // Generate PNG file
  function generatePNG() {
    // Adding new ReactFlow instance to the DOM
    const container = document.createElement("div");
    container.id = "second-reactflow-container";
    container.style.width = "1000px";
    container.style.height = "1000px";
    document.body.appendChild(container);

    ReactDOM.render(
      <EditorContextProvider>
        <ControlContextProvider>
          <DiagramScreenshot
            data={data}
            params={{ width: "1000px", type: "PNG" }}
          />
        </ControlContextProvider>
      </EditorContextProvider>,
      container
    );

    // Wait for the component to fully render
    setTimeout(() => {
      // Wygeneruj zrzut ekranu za pomocą html2canvas
      html2canvas(document.getElementById("second-reactflow-container"))
        .then((canvas) => {
          // Tutaj możesz postąpić z obrazem np. zapisać go jako plik PNG lub wyświetlić
          // Przykład zapisu obrazu:
          const imageURL = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = imageURL;
          downloadLink.download = "reactflow_diagram.png";

          // Kliknij na link w celu pobrania obrazu
          downloadLink.click();

          // Remove the second ReactFlow instance from the DOM
          removeInstance();
        })
        .catch((error) => {
          console.error("Błąd podczas generowania zrzutu ekranu:", error);
          // Remove the second ReactFlow instance from the DOM
          removeInstance();
        });
    }, 1000);

    const removeInstance = () => {
      const container = document.getElementById("second-reactflow-container");
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.parentNode.removeChild(container);
      }
    };
  }

  // Generate PDF file
  function generatePDF() {
    // Dodanie nowej instancji ReactFlow do DOM
    const container = document.createElement("div");
    container.id = "second-reactflow-container";
    container.style.width = "800px";
    container.style.height = "800px";
    document.body.appendChild(container);

    ReactDOM.render(
      <EditorContextProvider>
        <ControlContextProvider>
          <DiagramScreenshot
            data={data}
            params={{ width: "800px", type: "PDF" }}
          />
        </ControlContextProvider>
      </EditorContextProvider>,
      container
    );

    // Poczekaj, aż komponent zostanie w pełni wyrenderowany
    setTimeout(() => {
      // Wygeneruj zrzut ekranu za pomocą html2canvas
      html2canvas(document.getElementById("second-reactflow-container"))
        .then((canvas) => {
          // Przekształć zrzut ekranu do formatu PDF
          const pdf = new jsPDF();
          pdf.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 0);
          pdf.save("reactflow_diagram.pdf");

          // Usuń drugą instancję ReactFlow z DOM
          removeInstance();
        })
        .catch((error) => {
          console.error("Błąd podczas generowania zrzutu ekranu:", error);
          // Usuń drugą instancję ReactFlow z DOM w przypadku błędu
          removeInstance();
        });
    }, 1000);

    // Funkcja usuwająca instancję ReactFlow z DOM
    const removeInstance = () => {
      const container = document.getElementById("second-reactflow-container");
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
        container.parentNode.removeChild(container);
      }
    };
  }

  return (
    <div className="buttonContainer">
      <button
        className="defaultBtn"
        onClick={() => {
          setIsShareModalMenu(!isModalMenu);
        }}
      >
        {" "}
        <img src={icon_export} alt="icon_export" className="headerIcon" />
        <p>Export</p>
      </button>{" "}
      {isModalMenu && (
        <div className="modalMenu">
          <button className="defaultBtn">
            {" "}
            <img src={icon_json} alt="icon_json" className="headerIcon" />{" "}
            <p>JSON</p>
          </button>{" "}
          <button className="defaultBtn" onClick={generateSQL}>
            {" "}
            <img src={icon_sql} alt="icon_sql" className="headerIcon" />{" "}
            <p>SQL</p>
          </button>{" "}
          <button className="defaultBtn" onClick={generatePDF}>
            {" "}
            <img src={icon_pdf} alt="icon_pdf" className="headerIcon" />{" "}
            <p>PDF</p>
          </button>{" "}
          <button className="defaultBtn" onClick={generatePNG}>
            {" "}
            <img
              src={icon_image}
              alt="icon_image"
              className="headerIcon"
            />{" "}
            <p>PNG</p>
          </button>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default HeaderExport;
