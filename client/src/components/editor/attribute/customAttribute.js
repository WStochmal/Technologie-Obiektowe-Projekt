// CustomAttribute.js
import React, { useState } from "react";
import { Handle } from "reactflow";

// style
import "./attribute.css";

const CustomAttribute = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Select input with all data types
  const MySQLDataTypesSelect = (defaultValue) => {
    // Lista typów danych MySQL
    const dataTypes = [
      "TINYINT",
      "SMALLINT",
      "MEDIUMINT",
      "INT",
      "BIGINT",
      "FLOAT",
      "DOUBLE",
      "DECIMAL",
      "DATE",
      "DATETIME",
      "TIMESTAMP",
      "TIME",
      "YEAR",
      "CHAR",
      "VARCHAR",
      "BINARY",
      "VARBINARY",
      "TINYBLOB",
      "BLOB",
      "MEDIUMBLOB",
      "LONGBLOB",
      "TINYTEXT",
      "TEXT",
      "MEDIUMTEXT",
      "LONGTEXT",
      "ENUM",
      "SET",
    ];

    return (
      <div>
        <select
          id="dataType"
          name="dataType"
          defaultValue={defaultValue}
          className="nodrag"
        >
          {dataTypes.map((type, index) => (
            <option key={index} value={type}>
              {" "}
              {type}{" "}
            </option>
          ))}{" "}
        </select>{" "}
      </div>
    );
  };
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  const handleBlur = () => {
    setIsEditing(false);
  };
  const handleChange = (e) => {
    setLabel(e.target.value);
  };

  return (
    <div
      className="nodrag custom-attribute"
      // onClick={() => {
      //   setIsSelected(!isSelected);
      // }}
      // style={{ background: isSelected ? "red" : "transparent" }}
    >
      <div className="custom-attribute-keyField"> </div>{" "}
      <div className="custom-attribute-labelField">
        {" "}
        {isEditing && label ? (
          <input
            type="text"
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <p onDoubleClick={handleDoubleClick}> {label} </p>
        )}{" "}
      </div>{" "}
      <div className="custom-attribute-typeField">
        {" "}
        {MySQLDataTypesSelect(data.type)}{" "}
      </div>{" "}
      <Handle
        position="right"
        style={{
          background: "#555",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id={`${data.id}-handle`}
        type="source"
        isConnectable={true}
      />{" "}
      <Handle
        position="left"
        style={{
          background: "#555",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id={`${data.id}-handle`}
        type="source"
        isConnectable={true}
      />{" "}
    </div>
  );
};

export default CustomAttribute;
