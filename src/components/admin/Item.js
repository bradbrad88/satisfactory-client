import React, { useRef } from "react";
import "../../stylesheets/EditItem.css";

const Item = ({ details, setActive }) => {
  const itemRef = useRef();

  const handleClick = e => {
    e.stopPropagation();
    const rect = itemRef.current.getBoundingClientRect();
    setActive(details, !details.active, rect);
  };

  return (
    <div
      ref={itemRef}
      className={`item-box ${details.active && "active"}`}
      onClick={handleClick}
    >
      <p className={"value"}>
        {details.itemName || details.title || details.recipeName}
      </p>
    </div>
  );
};

export default Item;
