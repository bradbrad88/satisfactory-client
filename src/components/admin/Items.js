import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import useApi from "../../hooks/useApi";
import ItemInput from "./ItemInput";
import ItemList from "./ItemList.";
import EditItem from "./EditItem";
import { add } from "../../utils/SvgIcons";

const ANIMATION_TIME = 800;

const Items = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [rect, setRect] = useState(null);
  const [mobileItemEntry, setMobileItemEntry] = useState(false);
  const data = useApi("/item");
  useEffect(() => {
    setItems(data);
  }, [data]);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const setActive = (activeItem, active, rect) => {
    setItems(prevState => {
      return prevState.map(item => ({
        ...item,
        active: activeItem?.itemId === item.itemId ? active : false,
      }));
    });
    setRect(rect);
    setEditItem(null);
    setTimeout(() => setEditItem(activeItem), 0);
  };

  const addNewItem = item => {
    setItems(prevState => [...prevState, item]);
  };

  const editExistingItem = editItemResponse => {
    console.log("edit item", editItemResponse);
    const editItem = editItemResponse[1];

    setTimeout(() => {
      setItems(prevState =>
        prevState.map(item => {
          return editItem.itemId === item.itemId ? editItem : item;
        })
      );
    }, ANIMATION_TIME);
    // setTimeout(() => setEditItem(null), 1500);
  };

  const deleteItem = deleteItem => {
    console.log("Items Component - Delete", deleteItem);
    setItems(prevState => prevState.filter(item => item.itemId !== deleteItem));
    setEditItem(null);
  };

  const handleMobileAddItem = () => {
    setMobileItemEntry(true);
  };

  const handleInputClose = () => {
    setMobileItemEntry(false);
  };

  return (
    <div className={"admin"}>
      {(isDesktopOrLaptop || mobileItemEntry) && (
        <ItemInput
          className={"new-item"}
          addNewItem={addNewItem}
          close={handleInputClose}
        />
      )}
      {!mobileItemEntry && <ItemList items={items} setActive={setActive} />}
      {editItem && (
        <EditItem
          item={editItem}
          rect={rect}
          editItem={editExistingItem}
          deleteItem={deleteItem}
          close={() => setActive(null, false, null)}
          smallScreen={!isDesktopOrLaptop}
        />
      )}
      {!isDesktopOrLaptop && !mobileItemEntry && (
        <button className={"add-item"} onClick={handleMobileAddItem}>
          {add(48)}
        </button>
      )}
    </div>
  );
};

export default Items;
