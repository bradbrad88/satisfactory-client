import React from "react";

const Select = ({ title, className, value, onChange, id, options }) => {
  const renderOptions = () => {
    return options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <select id={id} onChange={onChange} value={value}>
      {renderOptions()}
    </select>
  );
};

export default Select;
