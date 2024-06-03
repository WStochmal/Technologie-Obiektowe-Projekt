// libraries
import axios from "axios";
import { useEffect, useState } from "react";

// styles
import "./style.css";

//hooks
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useEditorContext } from "../../../hooks/useEditorContext";

// icons
import icon_close from "../../../assets/icons/close.png";
import icon_check from "../../../assets/icons/check.png";

const ModalGenerate = ({ params }) => {
  const [connectionString, setConnectionString] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [databaseQueries, setDatabaseQueries] = useState([]);
  const [queryListConsole, setQueryListConsole] = useState([]);
  const [generateStatus, setGenerateStatus] = useState("Waiting for start");

  const { socket } = useAuthContext();
  const { data } = useEditorContext();

  const testConnection = async () => {
    setConnectionStatus("pending");
    setQueryListConsole([]);
    setGenerateStatus("Waiting for start");

    const response = await axios.post(
      "http://127.0.0.1:5000/api/diagram/generate-to-database-test-uri",
      { db_url: connectionString, diagram: data.diagram }
    );

    setConnectionStatus(response.data.status);

    if (response.data.status === "success") {
      setDatabaseQueries(response.data.queries);
    } else {
      setConnectionError(response.data.error);
    }
  };

  const performQuery = async () => {
    setQueryListConsole([]);
    const response = await axios.post(
      "http://127.0.0.1:5000/api/diagram/generate-to-database",
      { db_url: connectionString, queries: databaseQueries }
    );

    if (response.data.success) {
      setGenerateStatus("Diagram sucessfully generated");
      setQueryListConsole((prevQueries) => [...prevQueries, response.data]);
    } else {
      setGenerateStatus("Error during generating diagram");
      setQueryListConsole((prevQueries) => [...prevQueries, response.data]);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleQueryResult = (data) => {
        console.log("Query result: ", data);
        const isSuccess = data.success;

        setQueryListConsole((prevQueries) => [...prevQueries, data]);

        setDatabaseQueries((prevQueries) =>
          prevQueries.map((query) => {
            if (query.name === data.query) {
              return { ...query, status: isSuccess ? "success" : "error" };
            }
            return query;
          })
        );
      };
      const handleQueryStart = (data) => {
        console.log("Query start: ", data);

        setQueryListConsole((prevQueries) => [...prevQueries, data]);

        console.log("Console: " + queryListConsole);
      };
      socket.on("query_result", handleQueryResult);
      socket.on("query_start", handleQueryStart);

      return () => {
        socket.off("query_result", handleQueryResult);
        socket.off("query_start", handleQueryStart);
      };
    }
  }, [socket]);

  const displayStatus = (status, type) => {
    switch (status) {
      case "success":
        return (
          <div
            className={type + "-status-type"}
            style={{ background: "var(--color_green)" }}
          >
            <img src={icon_check} alt="success" />
          </div>
        );
      case "error":
        return (
          <div
            className={type + "-status-type"}
            style={{ background: "var(--color_red)" }}
          >
            <img src={icon_close} alt="error" />
          </div>
        );
      case "pending":
        return <div className={type + "-status-type"}></div>;
      default:
        return <div className={type + "-status-type"}></div>;
    }
  };

  return (
    <div className="generate-container">
      <div className="generate-container-uri">
        {displayStatus(connectionStatus, "connection")}
        <input
          type="text"
          placeholder="Database URI"
          onChange={(e) => {
            setConnectionString(e.target.value);
          }}
        />
        <button onClick={testConnection}>Test connection</button>
      </div>
      {connectionStatus === "error" && (
        <div className="generate-container-uri-error">
          <p>{connectionError}</p>
        </div>
      )}
      {connectionStatus === "success" && (
        <div className="generate-container-queries">
          <div className="generate-container-queries-header">
            <p>Generate status: {generateStatus}</p>
            <button onClick={performQuery}>Generate</button>
          </div>
          <div className="generate-container-queries-content">
            <div className="queries-list">
              <h4>Queries Content</h4>
              <p>Tables</p>
              {connectionStatus &&
                databaseQueries.length > 0 &&
                databaseQueries
                  .filter((query) => query.type === "table") // Filtrowanie tabel
                  .map((query, index) => (
                    <div className="query-object" key={index}>
                      <div className="query-object-status">
                        {displayStatus(query.status, "query")}
                      </div>
                      <div className="query-object-name">{query.name}</div>
                    </div>
                  ))}
              <p>Relationships</p>
              {connectionStatus &&
                databaseQueries.length > 0 &&
                databaseQueries
                  .filter((query) => query.type === "relationship") // Filtrowanie relacji
                  .map((query, index) => (
                    <div className="query-object" key={index}>
                      <div className="query-object-status">
                        {displayStatus(query.status, "query")}
                      </div>
                      <div className="query-object-name">{query.name}</div>
                    </div>
                  ))}
            </div>
            <div className="queries-list-console">
              <h4>Console log</h4>
              {queryListConsole &&
                queryListConsole.map((query, index) => {
                  return (
                    <div className="query-console" key={index}>
                      <p className="consoleText">{query.message}</p>
                      {!query.success && (
                        <p className="consoleText">{query.error}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalGenerate;
