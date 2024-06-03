import { useState } from "react";

const ModalShare = ({ params }) => {
  return (
    <div className="generate-container">
      <input
        type="text"
        placeholder="Database url"
        onChange={(e) => {
          setConnectionString(e.target.value);
        }}
      />
      <button onClick={testConnection}>Test connection</button>
      <p>{connectionStatus}</p>
    </div>
  );
};

export default ModalShare;
