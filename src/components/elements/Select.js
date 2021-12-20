import React from "react";

const Select = ({ title, className, value, onChange, id, options, style }) => {
  const handleChange = e => {
    onChange(e);
  };

  const onClick = e => {
    onChange(e);
  };

  const renderOptions = () => {
    return options.map(option => (
      <option key={option.id} value={option.id}>
        {option.title}
      </option>
    ));
  };

  return (
    <select
      id={id}
      onChange={handleChange}
      value={value}
      style={style}
      onClick={onClick}
    >
      {renderOptions()}
    </select>
  );
};

export default Select;
