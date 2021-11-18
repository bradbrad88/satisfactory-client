import React, { useState, useRef } from "react";
import OutsideAlerter from "utils/OutsideAlerter";

// import 'stylesheets/FactoryBuilder.css'

const InputEditor = ({
  value,
  label,
  placeholder,
  className,
  handleChange,
  type,
  id,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const ref = useRef();
  const onClick = toggle => {
    setEditMode(toggle);
    if (toggle) setFocus();
  };
  const onChange = e => {
    setNewValue(e.target.value);
  };
  const onKeyDown = e => {
    const { key } = e;
    if (key === "Enter") {
      // setNewValue(e.target.value);
      handleChange(e.target.value);
      setEditMode(false);
    }
  };
  const setFocus = () => {
    ref.current?.select();
  };

  return (
    <OutsideAlerter onClickOutside={onClick} id={id}>
      <div
        className={`${className} ${editMode && "edit-mode"}`}
        onMouseDown={e => e.stopPropagation()}
        // onClick={e => e.stopPropagation()}
      >
        <label htmlFor={id}>{label}</label>

        <input
          // readOnly={!editMode}
          ref={ref}
          style={{ display: editMode ? "inline-block" : "none" }}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type={type}
          placeholder={placeholder}
          value={newValue}
          id={id}
        ></input>

        <div
          className={"display"}
          style={{ display: editMode ? "none" : "inline-block" }}
        >
          {value}
        </div>
      </div>
    </OutsideAlerter>
  );
};

export default InputEditor;
