import { useState, useEffect, useCallback } from "react";

const useData = () => {
  const [recipes, setRecipes] = useState([]);
  const [items, setItems] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_HOST}/`);
      const { data } = await res.json();
      // const { recipes, items } = data;
      processItems(data);
      setItems(data.items);
      setRecipes(data.recipes);
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processItems = data => {
    const { items, recipes } = data;
    if (!items) return;
    recipes.forEach(recipe => {
      recipe.RecipeItems.filter(
        recipeItem => recipeItem.direction === "output"
      ).forEach(recipeItem => {
        const item = items.find(item => item.itemId === recipeItem.itemId);
        if (!item) return console.log("item not found", recipeItem.itemId);
        if (!item.recipes) {
          item.recipes = [recipe];
        } else {
          item.recipes.push(recipe);
          item.recipes.sort((a, b) => {
            // if (a.RecipeItems.length === b.RecipeItems.length) {
            //   return b.category === "standard";
            // }
            // return b.RecipeItems.length < a.RecipeItems.length;
            if (a.category === b.category)
              return b.RecipeItems.length < a.RecipeItems.length;

            return b.category === "standard";
          });
        }
      });
    });
    recipes.forEach(recipe => {
      recipe.RecipeItems.forEach(recipeItem => {
        const item = items.find(item => item.itemId === recipeItem.itemId);
        recipeItem.item = item;
      });
    });
  };

  return { items, recipes };
};

export default useData;
