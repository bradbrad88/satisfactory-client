import React, { forwardRef } from "react";

const Text = forwardRef(
  ({ item, value, error, handleInputChange, id, label, placeholder }, ref) => {
    return (
      <div className="field">
        <label htmlFor={`${id} ${item && "update"}`}>{label}</label>
        <input
          autoFocus
          type={"text"}
          placeholder={placeholder}
          onChange={handleInputChange}
          value={value}
          // the 'update' value is to differentiate between when there are 2 instances on screen, eg, NewItem and EditItem
          id={`${id} ${item && "update"}`}
          enterKeyHint={"next"}
          ref={ref}
        />
        {error && <p>{error}</p>}
      </div>
    );
  }
);

export default Text;
