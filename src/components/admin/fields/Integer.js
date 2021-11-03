import React from "react";

const Integer = ({
  item,
  value,
  error,
  handleInputChange,
  placeholder,
  id,
  label,
  step,
}) => {
  return (
    <div className="field">
      <label htmlFor={`${id} ${item && "update"}`}>{label}</label>
      <input
        type={"number"}
        step={step}
        placeholder={placeholder}
        onChange={handleInputChange}
        value={value}
        id={`${id} ${item && "update"}`}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default Integer;
