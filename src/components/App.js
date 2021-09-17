import React, { useState, useEffect } from "react";

const App = () => {
  const [textInput, setTextInput] = useState("");
  const [item, setItem] = useState("");
  useEffect(() => {
    getRecipe();
  }, [textInput]);
  const recipes = [
    {
      title: "Iron Ingot",
      input: [{ item: "iron ore", amount: 30 }],
      output: [{ item: "iron ingot", amount: 30 }],
      alt: false,
      building: "smelter",
    },
    {
      title: "Iron Plate",
      input: [{ item: "iron ingot", amount: 30 }],
      output: [{ item: "iron plate", amount: 20 }],
      alt: false,
      building: "constructor",
    },
    {
      title: "Iron Rod",
      input: [{ item: "iron ingot", amount: 15 }],
      output: [{ item: "iron rod", amount: 15 }],
      alt: false,
      building: "constructor",
    },
  ];

  const ironIngot = recipes.find((recipe) => recipe.title === "Iron Ingot");

  const getRecipe = () => {
    const recipe = recipes.reduce((result, recipe) => {
      // check if input state matches the output of a recipe
      console.log(recipe.output);
      console.log(textInput);
      if (
        recipe.output.find((output) => {
          return output.item === textInput;
        })
      ) {
        result.push(recipe);
      }
    }, []);
    console.log(recipe);
  };

  const createItemRecipeMap = () => {
    const itemList = recipes.reduce((result, recipe) => {
      recipe.output.forEach((output) => {
        result[output.item];
      });
    }, {});
  };

  console.log(item);
  return (
    <div>
      <input
        type={"text"}
        onChange={(e) => setTextInput(e.target.value)}
        value={textInput}
      />
    </div>
  );
};

export default App;
