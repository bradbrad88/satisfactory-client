import React, { useState } from "react";
import Item from "./Item";
import "../../stylesheets/Admin.css";

const Category = ({ category, items }) => {
  const [collapse, setCollapse] = useState(false);
  const renderItems = () => {
    return items.map(item => {
      return <Item details={item} />;
    });
  };

  return (
    <div className={"category-container"}>
      <div className={"category-header"} onClick={() => setCollapse(!collapse)}>
        <h2>{category}</h2>
      </div>
      <div className={`category-collapsible ${collapse && "collapse"}`}>
        <div className={`items-container`}>{renderItems()}</div>
      </div>
    </div>
  );
};

export default Category;
