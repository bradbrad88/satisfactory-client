import React from "react";

const NumberInput = ({
  item,
  value,
  error,
  handleInputChange,
  placeholder,
  id,
  label,
  step,
  style,
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
        style={style}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default NumberInput;
