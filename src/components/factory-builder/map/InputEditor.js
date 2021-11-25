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
  const [active, setActive] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const ref = useRef();

  const onClickInside = () => {
    if (active) return;
    setActive(true);
    setFocus();
  };

  const onClickOutside = () => {
    setActive(false);
  };

  // const onClick = toggle => {
  //   setEditMode(toggle);
  //   if (toggle) setFocus();
  // };

  const onChange = e => {
    setNewValue(e.target.value);
  };
  const onKeyDown = e => {
    const { key } = e;
    if (key === "Enter") {
      // setNewValue(e.target.value);
      handleChange(e.target.value);
      setActive(false);
    }
  };
  const setFocus = () => {
    setTimeout(() => {
      ref.current?.select();
    }, 0);
  };

  return (
    <OutsideAlerter onClickOutside={onClickOutside} onClickInside={onClickInside}>
      <div
        className={`${className} ${active && "edit-mode"}`}
        // onMouseDown={e => e.stopPropagation()}
        // onClick={e => e.stopPropagation()}
      >
        <label htmlFor={id}>{label}</label>

        <input
          // readOnly={!editMode}
          ref={ref}
          style={{ display: active ? "inline-block" : "none" }}
          onChange={onChange}
          onKeyDown={onKeyDown}
          type={type}
          placeholder={placeholder}
          value={newValue}
          id={id}
        ></input>

        <div
          className={"display"}
          style={{ display: active ? "none" : "inline-block" }}
        >
          {value}
        </div>
      </div>
    </OutsideAlerter>
  );
};

export default InputEditor;
