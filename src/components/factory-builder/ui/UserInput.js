import React, { useState, useMemo, useContext } from "react";
import Category from "components/elements/fields/Category";
import { ADD_NEW_ITEM } from "reducers/buildingStepsReducer";
import { FactoryManagerContext } from "contexts/FactoryManagerContext";

const UserInput = () => {
  const { items, dispatch } = useContext(FactoryManagerContext);
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
    const action = {
      type: ADD_NEW_ITEM,
      payload: {
        options: { item, imported: true, userAdded: true, ver: 1 },
      },
    };
    dispatch(action);
  };

  const style = () => {
    return { width: "11rem", fontSize: "0.8rem" };
  };

  return (
    <div className={"ui-component"}>
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
    </div>
  );
};

export default UserInput;
