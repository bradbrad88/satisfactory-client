import React, { useRef, useEffect } from "react";

const OutsideAlerter = ({ children, onClickOutside, onClickInside }) => {
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = e => {
      if (!ref.current?.contains(e.target)) {
        onClickOutside(e);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClickOutside]);
  return (
    <div onClickCapture={onClickInside} ref={ref}>
      {children}
    </div>
  );
};

export default OutsideAlerter;
