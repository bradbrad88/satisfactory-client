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

  const handleAddOutput = () => {
    const action = {
      type: ADD_NEW_ITEM,
      payload: { output: { type: "store", qty, item } },
    };
    dispatch(action);
  };

  return (
    <div className={"ui-component"}>
      <Category
        label={"Select an item"}
        options={itemOptions}
        value={item?.itemId}
        onChange={handleItem}
      />
      <NumberInput
        label={"Quantity"}
        placeholder={"Items/min..."}
        handleInputChange={handleQuantity}
        value={qty}
      />
      <button onClick={handleAddOutput}>Add New Item</button>
    </div>
  );
};

export default UserInput;
