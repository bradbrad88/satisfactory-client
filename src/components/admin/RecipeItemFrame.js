import React, { useEffect, useMemo, useCallback } from "react";
import useGetItems from "../../hooks/useGetItems";
import RecipeItem from "./fields/RecipeItem";

const RecipeItemFrame = ({ building, value, onChange }) => {
  const { itemsByTransportType: items } = useGetItems();

  const handleChange = useCallback((recipeItem, oldItem) => {
    let newState = [...value];
    const i = value.indexOf(oldItem);
    if (i === -1) {
      newState = newState.concat(recipeItem);
    } else {
      newState[i] = recipeItem;
    }
    onChange(newState);
  });
  console.log("recipe item frame", value);
  const discardExcessItems = recipeItems => {
    const newState = value.filter(item => !recipeItems.includes(item));
    if (recipeItems.length > 0) onChange(newState);
  };

  const inputs = direction => {
    if (!building) return null;
    const outputValue = value.filter(a => a.direction === direction);

    // map over each input for the building, find a recipe item that fits the direction and type and slot the value in
    // items to be removed from the outputValue array as we go so that any remaining items that don't have a place to fit (ie incorrect recipe for building type) can be processed out of the parent's state
    const io = building[direction].map(input => {
      const recipeItem = outputValue.find(a => a.type === input.type);
      const i = outputValue.indexOf(recipeItem);
      outputValue.splice(i, 1);
      return (
        <RecipeItem
          items={items[input.type] || []}
          direction={input.direction}
          key={input.key}
          type={input.type}
          onChange={handleChange}
          value={recipeItem}
        />
      );
    });
    discardExcessItems(outputValue);
    return io;
  };

  return (
    <div>
      <h3>Inputs</h3>
      {inputs("input")}
      <h3>Outputs</h3>
      {inputs("output")}
    </div>
  );
};

export default RecipeItemFrame;
