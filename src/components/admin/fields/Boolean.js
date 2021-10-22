import React, { useState, useRef } from "react";

const Boolean = ({ id, label, item, handleInputChange, value }) => {
  const [checked, setChecked] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef();
  const onClick = e => {
    // window.focus(ref.current);
    const newValue = !checked;
    setChecked(newValue);
    handleInputChange(newValue);
  };

  return (
    <div className={"field slider"}>
      <label
        id={`${id} ${item && "update"}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        {label}
      </label>
      <div
        className={`switch ${value && "active"} ${hover && "hover"}`}
        type={"checkbox"}
        onClick={onClick}
        id={`${id} ${item && "update"}`}
        ref={ref}
      >
        <span className={"slider"}></span>
      </div>
    </div>
  );
};

export default Boolean;
