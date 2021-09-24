import React, { useState, useMemo, useEffect, useRef } from "react";
import ItemInput from "./ItemInput";
import "../../stylesheets/EditItem.css";

// Responsible for handling the 3d environment to serve up the ItemInput component on
const EditItem = ({ item, rect, editItem, deleteItem, close, smallScreen }) => {
  const [nameChange, setNameChange] = useState("");
  const [animate, setAnimate] = useState(false);
  const faceRef = useRef();
  console.log("screen height", window.screen.height, window.innerHeight);
  useEffect(() => {
    window.onscroll = () => window.scrollTo(0, 0);
    return () => (window.onscroll = null);
  }, [item]);

  const style = useMemo(() => {
    if (!rect) return;
    const { top, left, width, height } = rect;
    const style = {
      position: "fixed",
      height: height + "px",
      width: width + "px",
      left: left + "px",
      top: top + "px",
    };
    return style;
  }, [rect]);

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => close(), 800);
  };

  const handleEditItem = editItemResponse => {
    setNameChange(editItemResponse[1].itemName);
    editItem(editItemResponse);
  };

  return (
    <div className={`edit-scene ${animate && "active"}`} style={style}>
      <div className={`edit-item ${animate && "active"}`}>
        <div className="face front">
          <p>{nameChange ? nameChange : item.itemName}</p>
        </div>
        <ItemInput
          item={item}
          className={"face back"}
          editItem={handleEditItem}
          deleteItem={deleteItem}
          close={handleClose}
        />
      </div>
    </div>
  );
};

export default EditItem;
