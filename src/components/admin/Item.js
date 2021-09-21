import React, { useState, useRef, useMemo } from "react";
import "../../stylesheets/EditItem.css";

const Item = ({ details, setActive }) => {
  const [spin, setSpin] = useState(false);
  // const [transform, setTransform] = useState({ x: 0, y: 0 });
  const itemRef = useRef();

  const handleClick = e => {
    e.stopPropagation();
    setSpin(!spin);
    const rect = itemRef.current.getBoundingClientRect();
    setActive(details, !details.active, rect);
  };

  // const transform = useMemo(() => {
  //   const { height, width } = containerSize;
  //   if (!itemRef.current) return { x: 0, y: 0 };
  //   const { offsetLeft, offsetTop, clientHeight, clientWidth } = itemRef.current;
  //   const x = width / 2 - 400 / 2 - offsetLeft;
  //   const y = height / 2 - 300 / 2 - offsetTop;
  //   console.log(height, clientHeight, offsetTop, y);

  //   return { x: x, y: y };
  // }, [containerSize, itemRef.current]);

  return (
    <div className={`item-box-scene`} ref={itemRef}>
      <div
        className={`item-box ${details.active && "active"}`}
        onClick={handleClick}
      >
        <span className={"value"}>{details.itemName}</span>
      </div>
    </div>
  );
};

export default Item;
