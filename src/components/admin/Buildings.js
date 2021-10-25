import React, { useCallback, useState } from "react";
import { useEffect } from "react/cjs/react.development";

import useApi from "../../hooks/useApi";
import EditBuildingForm from "./EditBuildingForm";
import EditList from "./EditList";
import PopOutHOC from "./PopOutHOC";

const ANIMATION_TIMER = 800;

const Buildings = () => {
  const [editItem, setEditItem] = useState(null);
  const [rect, setRect] = useState(null);
  const [animateClose, setAnimateClose] = useState(false);
  const { items } = useApi("buildings");
  const closeEditForm = useCallback(() => {
    if (!editItem) return;
    setAnimateClose(true);
    setTimeout(() => {
      setEditItem(null);
      setAnimateClose(false);
    }, ANIMATION_TIMER);
  }, [editItem]);
  useEffect(() => {
    window.addEventListener("click", closeEditForm);
    return () => window.removeEventListener("click", closeEditForm);
  }, [closeEditForm]);
  const setActive = (activeItem, active, rect) => {
    console.log(activeItem, active, rect);
    setRect(rect);
    setEditItem(null);
    setTimeout(() => {
      setEditItem(activeItem);
    }, 0);
  };
  return (
    <div className={"admin"}>
      <EditBuildingForm />
      <EditList
        items={items}
        setActive={setActive}
        closeDelay={editItem ? ANIMATION_TIMER : 0}
      />
      {editItem && (
        <PopOutHOC rect={rect} animate={animateClose} title={editItem.title}>
          <EditBuildingForm building={editItem} />
        </PopOutHOC>
      )}
    </div>
  );
};

export default Buildings;
