import React from "react";
import { ProgressBar as BootstrapProgressBar } from "react-bootstrap";

const ProgressBar = ({ progress }) => {
  return (
    <div
      className="mb-4"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%", // Ensure it takes full width
      }}
    >
      <div style={{ width: "500px" }}>
        <BootstrapProgressBar now={progress} label={`${progress}%`} />
      </div>
    </div>
  );
};

export default ProgressBar;
