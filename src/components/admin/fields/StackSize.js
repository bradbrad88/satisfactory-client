import React from "react";

const StackSize = ({ item, value, error, handleInputChange }) => {
  return (
    <div className="field">
      <label htmlFor={`stacksize${item && "update"}`}>STACK SIZE</label>
      <input
        type={"number"}
        step={50}
        placeholder={"STACK SIZE..."}
        onChange={handleInputChange}
        onBlur={handleInputChange}
        value={value}
        id={`stacksize${item && "update"}`}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default StackSize;
