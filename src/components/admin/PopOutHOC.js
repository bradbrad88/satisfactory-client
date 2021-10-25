import React, { useEffect, useMemo, useState } from "react";
import "../../stylesheets/EditItem.css";
// import { useMemo } from "react/cjs/react.development";

const PopOutHOC = ({ rect, children, close, animate, title }) => {
  // const [animate, setAnimate] = useState(false);
  useEffect(() => {
    window.onscroll = () => window.scrollTo(0, 0);
    return () => (window.onscroll = null);
  }, []);

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
    // setAnimate(true);
    setTimeout(() => {
      close();
    }, 800);
  };

  return (
    <div
      className={`edit-scene ${animate && "active"}`}
      style={style}
      onClick={e => e.stopPropagation()}
    >
      <div className={`edit-item ${animate && "active"}`}>
        <div className="face front">
          <p>{title}</p>
        </div>
        <div className="face back">{children}</div>
      </div>
    </div>
  );
};

export default PopOutHOC;
