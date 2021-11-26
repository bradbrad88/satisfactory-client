import React from "react";

const Select = ({ title, className, value, onChange, id, options, style }) => {
  const renderOptions = () => {
    return options.map(option => (
      <option key={option.id} value={option.id}>
        {option.title}
      </option>
    ));
  };

  return (
    <select id={id} onChange={onChange} value={value} style={style}>
      {renderOptions()}
    </select>
  );
};

export default Select;
