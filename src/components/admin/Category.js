import React, { useState, useRef, useEffect } from "react";
import Item from "./Item";
import "../../stylesheets/Admin.css";

const Category = ({ category, items, setActive }) => {
  const [collapse, setCollapse] = useState(false);

  const container = useRef();
  useEffect(() => {
    window.addEventListener("click", cancelActive);
    return () => {
      window.removeEventListener("click", cancelActive);
    };
  }, []);

  const renderItems = () => {
    return items
      .sort((a, b) => a.points - b.points)
      .map(item => {
        return <Item details={item} key={item.itemId} setActive={setActive} />;
      });
  };

  const cancelActive = e => {
    e.stopPropagation();
    setActive(null, false, null);
  };

  // pass function on to parent to handle state - add property to {items} to indicate Active
  return (
    <div className={"category-container"}>
      <div className={"category-header"} onClick={() => setCollapse(!collapse)}>
        <h2>{category}</h2>
      </div>
      <div
        className={`category-collapsible ${collapse && "collapse"}`}
        onClick={cancelActive}
      >
        <div className={`items-container`} ref={container}>
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default Category;
