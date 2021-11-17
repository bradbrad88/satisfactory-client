import React from "react";
import useGetItems from "../../hooks/useGetItems";
import RecipeItem from "../elements/fields/RecipeItem";

const RecipeItemFrame = ({ building, value, onChange }) => {
  const { itemsByTransportType: items } = useGetItems();
  console.log("value", value);

  const handleChange = (recipeItem, oldItem) => {
    let newState = [...value];
    newState.filter(recipeItem => recipeItem.itemId);
    const i = value.indexOf(oldItem);
    if (!recipeItem && !oldItem) {
      return onChange(newState);
    }
    if (i === -1) {
      newState = newState.concat(recipeItem);
    } else {
      if (!recipeItem) {
        newState.splice(i, 1);
      } else {
        newState[i] = recipeItem;
      }
    }
    onChange(newState);
  };

  const discardExcessItems = recipeItems => {
    // This function removes recipe items that don't fit into the input/output schema of the building selected
    const newState = value.filter(item => !recipeItems.includes(item));
    if (recipeItems.length > 0) onChange(newState);
  };

  const inputs = direction => {
    if (!building) return null;
    // const outputValue = value.filter(a => a.direction === direction);
    // console.log("output values", [...outputValue]);
    // // map over each input for the building, find a recipe item that fits the direction and type and slot the value in
    // // items to be removed from the outputValue array as we go so that any remaining items that don't have a place to fit (ie incorrect recipe for building type) can be processed out of the parent's state

    // Want to sort by key first - if a recipeItem has a key then it is attached to a building input/output

    // IO is an array of objects with key, direction and type

    const recipeItemValues = value.filter(
      recipeItem => recipeItem.direction === direction
    );

    const io = building[direction]
      .sort((a, b) => (a.type === b.type ? b.key > a.key : b.type === "conveyor"))

      .map(input => {
        const recipeItem = recipeItemValues.find(
          recipeItem =>
            recipeItem.key === input.key ||
            (!recipeItem.key && recipeItem.type === input.type)
        );

        const i = recipeItemValues.indexOf(recipeItem);

        if (i > -1) recipeItemValues.splice(i, 1);
        return (
          <RecipeItem
            items={items[input.type] || []}
            direction={input.direction}
            key={input.key}
            id={input.key}
            type={input.type}
            onChange={handleChange}
            value={recipeItem}
          />
        );
      });
    discardExcessItems(recipeItemValues);
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
