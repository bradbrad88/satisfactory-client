import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import ItemInput from "./ItemInput";
import ItemList from "./ItemList.";
import "../../stylesheets/Main.css";

const Admin = () => {
  const [items, setItems] = useState([]);
  const data = useApi();
  useEffect(() => {
    setItems(data);
  }, [data]);
  // const ironIngot = recipes.find(recipe => recipe.title === "Iron Ingot");

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

  const addNewItem = item => {
    setItems(prevState => [...prevState, item]);

    console.log("items - Admin", items);
  };

  console.log(items);
  return (
    <div className={"admin"}>
      {/* <input
        type={"text"}
        onChange={e => setTextInput(e.target.value)}
        value={textInput}
      /> */}
      <ItemInput addNewItem={addNewItem} />
      <ItemList items={items} />
    </div>
  );
};

export default Admin;
