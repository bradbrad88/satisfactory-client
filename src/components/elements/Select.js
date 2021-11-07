import React from "react";

const Select = ({ title, className, value, onChange, id, options }) => {
  const renderOptions = () => {
    return options.map(option => (
      <option key={option.id} value={option.id}>
        {option.title}
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
