import React, { useMemo } from "react";
import Category from "./Category";
import "../../stylesheets/Admin.css";

const EditList = ({ items, setActive, closeDelay }) => {
  const groupedItems = useMemo(() => {
    // Convert items to an object that contains each category as a property
    // Each category contains an array of its items
    if (!items) return [];

    return items.reduce((groups, item) => {
      const group = groups[item.category] || [];
      group.push(item);
      groups[item.category] = group;
      return groups;
    }, {});
  }, [items]);

  const renderCategories = () => {
    return Object.entries(groupedItems).map(category => {
      return (
        <Category
          category={category[0]}
          items={category[1]}
          setActive={setActive}
          key={category[0]}
          closeDelay={closeDelay}
        />
      );
    });
  };

  return <div className={"container item-list"}>{renderCategories()}</div>;
};

export default EditList;
