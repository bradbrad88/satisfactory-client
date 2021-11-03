import React, { useState, useRef, useMemo } from "react";
import { useParams } from "react-router";
import EditBuildingForm from "../components/admin/EditBuildingForm";
import EditItemForm from "../components/admin/EditItemForm";
import EditRecipeForm from "../components/admin/EditRecipeForm";

const useAdminSetup = () => {
  const buildingForm = useRef(EditBuildingForm);
  const recipeForm = useRef(EditRecipeForm);
  const itemForm = useRef(EditItemForm);
  const { section } = useParams();

  const getSection = useMemo(() => {
    switch (section) {
      case "buildings":
        return {
          SectionComponent: buildingForm.current,
          key: "buildingId",
          title: "title",
          section,
        };
      case "items":
        return {
          SectionComponent: itemForm.current,
          key: "itemId",
          title: "itemName",
          section,
        };
      case "recipes":
        return {
          SectionComponent: recipeForm.current,
          key: "recipeId",
          title: "recipeName",
          section,
        };
      default:
        return {};
    }
  }, [section]);

  return getSection;
};

export default useAdminSetup;
