import React, { useState, useMemo, useEffect } from "react";
import ItemInput from "./ItemInput";
import "../../stylesheets/EditItem.css";

// Responsible for handling the 3d environment to serve up the ItemInput component on
const EditItem = ({ item, rect, editItem, deleteItem, close, smallScreen }) => {
  const [animate, setAnimate] = useState(false);
  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  // const [panelSize, setPanelSize] = useState({
  //   width: window.innerWidth * 0.4,
  //   height: window.innerHeight * 0.6,
  // });
  console.log("screen height", window.screen.height, window.innerHeight);
  useEffect(() => {
    // document.body.classList.add("noscroll");
    // createKeyframe();
    // window.addEventListener("resize", handleWindowResize);
    // setAnimate(false);
    // setTimeout(() => {
    //   setAnimate(true);
    // }, 10);
    return () => document.body.classList.remove("noscroll");
  }, [item]);

  const createKeyframe = () => {
    // const stylesheet = document.styleSheets[0];
    // const animationName = "flip-in";
    // const keyframe = `@keyframes ${animationName} {
    //   from {
    //   }
    //   to {
    //   }
    // }`;
    // stylesheet.insertRule(keyframe, stylesheet.cssRules.length);
  };

  const handleWindowResize = () => {
    // setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    // setPanelSize({
    //   width: window.innerWidth * 0.4,
    //   height: window.innerHeight * 0.6,
    // });
  };

  const style = useMemo(() => {
    console.log("rect", rect);
    if (!rect) return;
    const { top, left, width, height } = rect;
    const style = {
      position: "fixed",
      height: height + "px",
      width: width + "px",
      left: left + "px",
      top: top + "px",
      // left: smallScreen ? "2vw" : `calc(50vw - ${panelSize.width / 2}px)`,
      // top: smallScreen ? "2vh" : `calc(50vh + 2rem - ${panelSize.height / 2}px)`,
    };

    // if (!animate) {
    //   style.left = left + "px";
    //   style.top = top + "px";
    // }

    return style;
  }, [rect]);

  const style2 = { ...style };

  const editItemStyle = () => {
    // if (!smallScreen) {
    //   return {
    //     height: panelSize.height + "px",
    //     width: panelSize.width + "px",
    //   };
    // }
    // return { position: "fixed", width: "96vw", height: "96vh", left: "0" };
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => close(), 800);
  };

  return (
    <div className={`edit-scene ${animate && "active"}`} style={style}>
      <div className={`edit-item ${animate && "active"}`}>
        <div className="face front">{item.itemName}</div>
        <ItemInput
          item={item}
          className={"face back"}
          editItem={editItem}
          deleteItem={deleteItem}
          close={handleClose}
        />
      </div>
    </div>
  );
};

export default EditItem;
