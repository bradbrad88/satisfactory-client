import React, { forwardRef } from "react";

const ItemName = forwardRef(({ item, value, error, handleInputChange }, ref) => {
  return (
    <div className="field">
      <label htmlFor={`itemname${item && "update"}`}>ITEM</label>
      <input
        autoFocus
        type={"text"}
        placeholder={"ITEM NAME..."}
        onChange={handleInputChange}
        value={value}
        id={`itemname${item && "update"}`}
        enterKeyHint={"next"}
        ref={ref}
      />
      {error && <p>{error}</p>}
    </div>
  );
});

export default ItemName;
