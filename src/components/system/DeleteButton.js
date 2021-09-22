import React, { useState, useRef, useEffect } from "react";

const DeleteButton = ({ handleDelete, className }) => {
  const [confirm, setConfirm] = useState(false);
  const timeoutRef = useRef();
  useEffect(() => {
    return clearTimeout(timeoutRef.current);
  });
  const initConfirm = () => {
    setConfirm(true);
    timeoutRef.current = setTimeout(() => setConfirm(false), 1500);
  };
  const handleClick = () => {
    if (!confirm) return initConfirm();
    handleDelete();
  };
  return (
    <button onClick={handleClick} className={`${className} ${confirm && "confirm"}`}>
      {confirm ? "Confirm" : "Delete"}
    </button>
  );
};

export default DeleteButton;
