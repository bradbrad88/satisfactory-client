import React, { useMemo } from "react";
import Category from "components/elements/fields/Category";
import NumberInput from "components/elements/fields/NumberInput";

const UserInterface = ({
  items,
  item,
  handleItem,
  qty,
  handleQuantity,
  newRecipe,
}) => {
  const itemOptions = useMemo(() => {
    console.log("items memo", items);
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

  const handleStart = () => {
    console.log("start");
    newRecipe();
  };

  console.log("items ui", items);

  return (
    <div className={"ui"}>
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
      <button onClick={handleStart}>Go!</button>
    </div>
  );
};

export default UserInterface;