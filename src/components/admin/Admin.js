import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import ItemInput from "./ItemInput";
import ItemList from "./ItemList.";
import EditItem from "./EditItem";
import "../../stylesheets/Main.css";

const Admin = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [rect, setRect] = useState(null);
  const data = useApi();
  useEffect(() => {
    setItems(data);
  }, [data]);

  // const getRecipe = () => {
  //   const recipe = recipes.reduce((result, recipe) => {
  //     // check if input state matches the output of a recipe
  //     console.log(recipe.output);
  //     console.log(textInput);
  //     if (
  //       recipe.output.find(output => {
  //         return output.item === textInput;
  //       })
  //     ) {
  //       result.push(recipe);
  //     }
  //   }, []);
  //   console.log(recipe);
  // };

  // const createItemRecipeMap = () => {
  //   const itemList = recipes.reduce((result, recipe) => {
  //     recipe.output.forEach((output) => {
  //       result[output.item];
  //     });
  //   }, {});
  // };

  const setActive = (activeItem, active, rect) => {
    setItems(prevState => {
      return prevState.map(item => ({
        ...item,
        active: activeItem?.itemId === item.itemId ? active : false,
      }));
    });
    setRect(rect);
    setEditItem(null);
    setTimeout(() => setEditItem(activeItem), 100);
  };

  const addNewItem = item => {
    setItems(prevState => [...prevState, item]);
  };

  const editExistingItem = editItem => {
    setItems(prevState =>
      prevState.map(item => {
        return editItem.itemId === item.itemId ? editItem : item;
      })
    );
    setTimeout(() => setEditItem(null), 1500);
  };

  return (
    <div className={"admin"}>
      {/* <input
        type={"text"}
        onChange={e => setTextInput(e.target.value)}
        value={textInput}
      /> */}
      <ItemInput addNewItem={addNewItem} />
      <ItemList items={items} setActive={setActive} />
      {editItem && (
        <EditItem item={editItem} rect={rect} editExistingItem={editExistingItem} />
      )}
      {/* <ItemInput item={editItem} editItem={editExistingItem} /> */}
    </div>
  );
};

export default Admin;
