import React, { useState, useMemo, useContext } from "react";
import Category from "components/elements/fields/Category";
import { ADD_NEW_ITEM } from "reducers/factoryManagerReducer";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const UserInput = () => {
  const { items, dispatch, activeFactory } = useContext(FactoryManagerContext);
  const [item, setInitialItem] = useState(null);

  const itemOptions = useMemo(() => {
    if (!items) return [];
    const itemOptions = items
      .map(item => ({
        title: item.itemName,
        id: item.itemId,
      }))
      .sort((a, b) => b.title < a.title);
    itemOptions.unshift({ title: "SELECT AN ITEM", id: "" });
    return itemOptions;
  }, [items]);

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleAddNewItem = () => {
    if (!item) return;
    const location = {
      row: 1,
      x: 0,
    };
    const options = {
      location,
      item,
      imported: true,
      userAdded: true,
    };
    const action = {
      type: ADD_NEW_ITEM,
      payload: {
        options,
      },
    };
    dispatch(action);
  };

  const handleTest = () => {
    console.log("test", activeFactory);
  };

  const style = () => {
    return { width: "11rem", fontSize: "0.8rem" };
  };

  return (
    <div className={"ui-component"}>
      {activeFactory ? (
        <>
          <Category
            className={"field"}
            label={"Select Item"}
            options={itemOptions}
            value={item?.itemId}
            onChange={handleItem}
            style={style()}
          />
          <div className="field">
            <button style={{ width: "10rem" }} onClick={handleAddNewItem}>
              Add New Item
            </button>
          </div>
          <div className="field">
            <button style={{ width: "10rem" }} onClick={handleTest}>
              Test
            </button>
          </div>
        </>
      ) : (
        <p className={"select-factory"}>
          Select a factory (in the factories tab) to begin
        </p>
      )}
    </div>
  );
};

export default UserInput;
