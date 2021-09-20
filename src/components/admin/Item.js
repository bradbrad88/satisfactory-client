import React from "react";

const Item = ({ details }) => {
  return (
    <div className={"item-box"}>
      <div className="front-face">
        {/* <span className={"field"}>Item:</span> */}
        <span className={"value"}>{details.itemName}</span>
      </div>
      <div className="back-face"></div>

      {/* <span className={"field"}>Category:</span>
      <span className={"value"}>{details.category}</span> */}
    </div>
  );
};

export default Item;
