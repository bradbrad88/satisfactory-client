import React, { useState, useMemo, useEffect } from "react";
import "../../stylesheets/Itembox.css";
import ItemInput from "./ItemInput";

const EditItem = ({ item, rect, editExistingItem }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(false);
    setTimeout(() => {
      setAnimate(true);
    }, 10);
  }, [item]);
  const style = useMemo(() => {
    const { top, left, width, height } = rect;

    const style = {
      position: "fixed",
      height: height + "px",
      width: width + "px",
      left: `calc(50vw - ${600 / 2}px)`,
      top: `calc(50vh - ${650 / 2}px)`,
    };

    if (!animate) {
      style.left = left + "px";
      style.top = top + "px";
    }

    return style;
  }, [rect, animate]);

  return (
    <div className={`edit-scene ${animate && "active"}`} style={style}>
      <div className={`edit-item ${animate && "active"}`}>
        <div className="face front">{item.itemName}</div>
        <ItemInput
          item={item}
          className={"face back"}
          editExistingItem={editExistingItem}
        />
        {/* <div className="face back">Back Face</div> */}
      </div>
    </div>
  );
};

export default EditItem;
