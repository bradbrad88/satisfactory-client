import React, { useCallback, useEffect } from "react";
import "stylesheets/FactoryBuilder.css";

const RecipeSelector = ({ recipes, location, selectionHandler, close }) => {
  console.log("rect", location);
  const clickAway = useCallback(() => {
    close();
  }, []);
  useEffect(() => {
    window.addEventListener("mousedown", clickAway);
    return () => window.removeEventListener("mousedown", clickAway);
  }, []);

  const onMouseDown = e => {
    e.stopPropagation();
  };

  const onClick = e => {
    e.stopPropagation();
    selectionHandler(parseInt(e.target.value));
    close();
  };

  const renderRecipes = () => {
    if (!recipes) return;
    return recipes.map(recipe => (
      <button value={recipe.recipeId} onClick={onClick} onMouseDown={onMouseDown}>
        {recipe.recipeName}
      </button>
    ));
  };

  return (
    <div
      className={"recipe-selector"}
      style={{
        left: `${location.offsetLeft + location.offsetWidth}px`,
        // top: `${location.top}px`,
      }}
    >
      {renderRecipes()}
    </div>
  );
};

export default RecipeSelector;
