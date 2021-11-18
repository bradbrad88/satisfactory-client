import React, { useRef, useEffect } from "react";

const OutsideAlerter = ({ children, onClickOutside, id }) => {
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = e => {
      e.stopPropagation();
      onClickOutside(ref.current?.contains(e.target));
    };
    document.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [ref]);
  return (
    <div className={"wrapper"} ref={ref}>
      {children}
    </div>
  );
};

export default OutsideAlerter;
