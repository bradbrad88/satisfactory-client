import React from "react";

const Points = ({ item, value, error, handleInputChange }) => {
  return (
    <div className="field">
      <label htmlFor={`points${item && "update"}`}>POINTS</label>
      <input
        type={"number"}
        placeholder={"RESOURCE SINK POINTS..."}
        onChange={handleInputChange}
        onBlur={handleInputChange}
        value={value}
        id={`points${item && "update"}`}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default Points;
