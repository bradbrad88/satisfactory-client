import React from "react";

import useApi from "../../hooks/useApi";
import EditRecipeForm from "./EditRecipeForm";
import EditList from "./EditList";

const Recipes = () => {
  const { items } = useApi("recipes");
  const setActive = () => {};
  return (
    <div className={"admin"}>
      <EditRecipeForm />
      <EditList items={items} setActive={setActive} />
    </div>
  );
};

export default Recipes;
