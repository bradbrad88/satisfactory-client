import React, { useState, useMemo } from "react";
import Category from "components/elements/fields/Category";
import NumberInput from "components/elements/fields/NumberInput";
import { ADD_NEW_ITEM } from "reducers/buildingStepsReducer";

const UserInput = ({ items, data, dispatch }) => {
  const [item, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);

  // const { handleQuantity, handleItem, handleAddOutput } = functions;

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

  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleAddNewItem = () => {
    // const output = { type: "store", qty, item };
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
        label={"Select an item"}
        options={itemOptions}
        value={item?.itemId}
        onChange={handleItem}
        style={style()}
      />
      <NumberInput
        className={"field"}
        label={"Quantity"}
        placeholder={"Items/min..."}
        handleInputChange={handleQuantity}
        value={qty}
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
