import { useMemo } from "react";
import { useParams } from "react-router";
import EditBuildingForm from "../components/admin/EditBuildingForm";
import EditItemForm from "../components/admin/EditItemForm";
import EditRecipeForm from "../components/admin/EditRecipeForm";
import { building, item, recipe } from "utils/SvgIcons";

const ICON_SIZE = 150;

const ADMIN_SECTIONS = [
  {
    SectionComponent: EditItemForm,
    key: "itemId",
    title: "itemName",
    section: "items",
    icon: item(ICON_SIZE),
    path: "/admin/items",
  },
  {
    SectionComponent: EditBuildingForm,
    key: "buildingId",
    title: "title",
    section: "buildings",
    icon: building(ICON_SIZE),
    path: "/admin/buildings",
  },
  {
    SectionComponent: EditRecipeForm,
    key: "recipeId",
    title: "recipeName",
    section: "recipes",
    icon: recipe(ICON_SIZE),
    path: "/admin/recipes",
  },
];

const useAdminSetup = () => {
  const { section } = useParams();

  const currentSection = useMemo(() => {
    return (
      ADMIN_SECTIONS.find(adminSection => adminSection.section === section) || {}
    );
  }, [section]);

  return {
    SectionComponent: currentSection.SectionComponent,
    key: currentSection.key,
    title: currentSection.title,
    section: currentSection.section,
    sections: ADMIN_SECTIONS,
  };
};

export default useAdminSetup;
