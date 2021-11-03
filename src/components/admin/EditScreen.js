import React, { useCallback, useState, useRef } from "react";
import { useParams } from "react-router";
import { useEffect } from "react/cjs/react.development";
import { useMediaQuery } from "react-responsive";
import useApi from "../../hooks/useApi";
import EditBuildingForm from "./EditBuildingForm";
import EditList from "./EditList";
import PopOutHOC from "./PopOutHOC";
import { add } from "../../utils/SvgIcons";
import useAdminSetup from "../../hooks/useAdminSetup";

const ANIMATION_TIMER = 800;

const EditScreen = () => {
  const [popupItem, setPopupItem] = useState(null);
  const [rect, setRect] = useState(null);
  const [animateClose, setAnimateClose] = useState(false);
  const [mobileItemEntry, setMobileItemEntry] = useState(false);
  // const { section } = useParams();
  const { SectionComponent, section, key, title } = useAdminSetup();
  // console.log("admin setup", test);
  const timeout = useRef();
  const { items, setActiveItem, addNewItem, editItem, deleteItem } = useApi(
    section,
    key,
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
    setActiveItem(activeItem, active);
    setRect(rect);
    setPopupItem(null);
    setTimeout(() => {
      setPopupItem(activeItem);
      setAnimateClose(false);
    }, 0);
  };

  const handleEdit = item => {
    setPopupItem(prevState => {
      const newState = { ...prevState };
      newState[title] = item[title];
      return newState;
    });
    editItem(item);
    closeEditForm();
    // setTimeout(() => setActive(null, null, null), ANIMATION_TIMER);
  };

  const handleDelete = item => {
    deleteItem(item);
    setActive(null, null, null);
  };

  if (!SectionComponent) return null;

  return (
    <div className={"admin"}>
      {(isDesktopOrLaptop || mobileItemEntry) && (
        <SectionComponent
          addNewItem={addNewItem}
          isDesktopOrLaptop={isDesktopOrLaptop}
          close={() => setMobileItemEntry(false)}
          items={items}
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
        <PopOutHOC rect={rect} animate={animateClose} title={popupItem[title]}>
          <SectionComponent
            existingItem={popupItem}
            close={closeEditForm}
            addNewItem={addNewItem}
            editItem={handleEdit}
            deleteItem={handleDelete}
            isDesktopOrLaptop={isDesktopOrLaptop}
            items={items}
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

export default EditScreen;
