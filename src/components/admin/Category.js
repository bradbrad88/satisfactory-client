import React, { useState, useRef } from "react";
import Item from "./Item";
import "../../stylesheets/Admin.css";

const Category = ({ category, items, setActive, closeDelay }) => {
  const [collapse, setCollapse] = useState(false);
  const container = useRef();
  // const cancelActive = useCallback(
  //   e => {
  //     e.stopPropagation();
  //     setActive(null, false, null);
  //   },
  //   [setActive]
  // );
  // useEffect(() => {
  //   window.addEventListener("click", cancelActive);
  //   return () => window.removeEventListener("click", cancelActive);
  // }, [cancelActive]);

  const renderItems = () => {
    return items
      .sort((a, b) => a.points - b.points)
      .map(item => {
        return (
          <Item
            details={item}
            key={item.buildingId || item.itemId || item.recipeId}
            setActive={setActive}
          />
        );
      });
  };

  const handleCollapse = () => {
    setTimeout(() => {
      setCollapse(!collapse);
    }, closeDelay);
  };

  // pass function on to parent to handle state - add property to {items} to indicate Active
  return (
    <div className={"category-container"}>
      <div className={"category-header"} onClick={handleCollapse}>
        <h2>{category}</h2>
      </div>
      <div
        className={`category-collapsible ${collapse && "collapse"}`}
        // onClick={cancelActive}
      >
        <div className={`items-container`} ref={container}>
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default Category;
