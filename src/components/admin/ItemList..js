import React, { useMemo } from "react";
import Category from "./Category";
import "../../stylesheets/Admin.css";

const ItemList = ({ items, setActive }) => {
  console.log("Item List Props", items);
  const renderCategories = () => {
    if (!items) return null;
    const groupedItems = items.reduce((groups, item) => {
      const group = groups[item.category] || [];
      group.push(item);
      groups[item.category] = group;
      return groups;
    }, {});
    return Object.entries(groupedItems).map(category => {
      return (
        <Category
          category={category[0]}
          items={category[1]}
          setActive={setActive}
          key={category[0]}
        />
      );
    });
  };
  renderCategories();
  return <div className={"container item-list"}>{renderCategories()}</div>;
};

export default ItemList;
