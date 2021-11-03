import React, { useCallback, useState, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import { useMediaQuery } from "react-responsive";
import useApi from "../../hooks/useApi";
import EditItemForm from "./EditItemForm";
import EditList from "./EditList";
import PopOutHOC from "./PopOutHOC";
import { add } from "../../utils/SvgIcons";

const ANIMATION_TIMER = 800;

const Items = () => {
  const [popupItem, setPopupItem] = useState(null);
  const [rect, setRect] = useState(null);
  const [animateClose, setAnimateClose] = useState(false);
  const [mobileItemEntry, setMobileItemEntry] = useState(false);
  const timeout = useRef();
  const { items, setActiveItem, addNewItem, editItem, deleteItem } = useApi(
    "items",
    "itemId",
    ANIMATION_TIMER
  );
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });

  const closeEditForm = useCallback(() => {
    if (!popupItem) return;
    setAnimateClose(true);
    timeout.current = setTimeout(() => {
      setActive(null, null, null);
      setPopupItem(null);
      setAnimateClose(false);
    }, ANIMATION_TIMER);
  }, [popupItem]);

  useEffect(() => {
    window.addEventListener("click", closeEditForm);
    return () => {
      window.removeEventListener("click", closeEditForm);
      clearTimeout(timeout.current);
    };
  }, [closeEditForm]);

  const setActive = (activeItem, active, rect) => {
    setActiveItem(activeItem, active, "buildingId");
    setRect(rect);
    setPopupItem(null);
    setTimeout(() => {
      setPopupItem(activeItem);
      setAnimateClose(false);
    }, 0);
  };

  const handleEdit = item => {
    setPopupItem(prevState => ({ ...prevState, title: item.title }));
    editItem(item);
  };

  const handleDelete = item => {
    deleteItem(item);
    setActive(null, null, null);
  };

  return (
    <div className={"admin"}>
      {(isDesktopOrLaptop || mobileItemEntry) && (
        <EditItemForm
          addNewItem={addNewItem}
          editItem={editItem}
          deleteItem={deleteItem}
          isDesktopOrLaptop={isDesktopOrLaptop}
          close={() => setMobileItemEntry(false)}
        />
      )}
      {!mobileItemEntry && (
        <EditList
          items={items}
          setActive={setActive}
          closeDelay={popupItem ? ANIMATION_TIMER : 0}
        />
      )}
      {popupItem && (
        <PopOutHOC rect={rect} animate={animateClose} title={popupItem.title}>
          <EditItemForm
            building={popupItem}
            close={closeEditForm}
            addNewItem={addNewItem}
            editItem={handleEdit}
            deleteItem={handleDelete}
            isDesktopOrLaptop={isDesktopOrLaptop}
          />
        </PopOutHOC>
      )}
      {!isDesktopOrLaptop && !mobileItemEntry && (
        <button className={"add-item"} onClick={() => setMobileItemEntry(true)}>
          {add(48)}
        </button>
      )}
    </div>
  );
};

export default Items;
