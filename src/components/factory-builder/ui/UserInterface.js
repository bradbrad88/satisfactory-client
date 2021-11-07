import React, { useMemo } from "react";
import Category from "components/elements/fields/Category";
import NumberInput from "components/elements/fields/NumberInput";

const UserInterface = ({ items, item, handleItem, qty, handleQuantity }) => {
  const itemOptions = useMemo(() => {
    if (!items) return [];
    return items
      .map(item => ({
        title: item.itemName,
        id: item.itemId,
      }))
      .sort((a, b) => b.title < a.title);
  }, [items]);

  const handleStart = () => {
    console.log("start");
  };

  return (
    <div className={"ui"}>
      <Category
        label={"Select an item"}
        options={itemOptions}
        value={item}
        onChange={handleItem}
      />
      <NumberInput
        label={"Quantity"}
        placeholder={"Items/min..."}
        handleInputChange={handleQuantity}
        value={qty}
      />
      <button onClick={handleStart}>Go!</button>
    </div>
  );
};

export default UserInterface;
