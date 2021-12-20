import React from "react";
import Select from "../Select";

const Category = ({ item, value, onChange, options, label, style, id }) => {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Select
        title={"CATEGORY"}
        value={value}
        onChange={onChange}
        id={id}
        options={options}
        style={style}
      />
    </div>
  );
};

export default Category;
