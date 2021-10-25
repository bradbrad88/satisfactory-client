import Items from "./Items";
import Buildings from "./Buildings";
import Recipes from "./Recipes";
import { building, item, recipe } from "../../utils/SvgIcons";

const ICON_SIZE = 150;
export const adminSetup = [
  { title: "Items", path: "/admin/items", component: Items, icon: item(ICON_SIZE) },
  {
    title: "Recipes",
    path: "/admin/recipes",
    component: Recipes,
    icon: recipe(ICON_SIZE),
  },
  {
    title: "Buildings",
    path: "/admin/buildings",
    component: Buildings,
    icon: building(ICON_SIZE),
  },
];
