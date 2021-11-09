import React, { useState, useRef, useContext, useMemo } from "react";
import { SearchContext } from "contexts/SearchContext";
import Item from "./Item";
import "../../stylesheets/Admin.css";

const Category = ({ category, items, setActive, closeDelay }) => {
  const [collapse, setCollapse] = useState(false);
  const container = useRef();
  const { debouncedSearchTerm } = useContext(SearchContext);
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

  const renderItems = useMemo(() => {
    let sortedList = items.sort((a, b) => {
      if (a.title) return b.title < a.title;
      if (a.recipeName) return b.recipeName < a.recipeName;
      if (a.itemName) return b.itemName < a.itemName;
      return false;
    });
    if (debouncedSearchTerm)
      sortedList = sortedList.filter(item => {
        let key;

        if (item.itemName) key = "itemName";
        if (item.title) key = "title";
        if (item.recipeName) key = "recipeName";
        // console.log("key", key, item);
        return item[key].toUpperCase().includes(debouncedSearchTerm.toUpperCase());
      });
    return sortedList.map(item => {
      return (
        <Item
          details={item}
          key={item.recipeId || item.buildingId || item.itemId}
          setActive={setActive}
        />
      );
    });
  }, [debouncedSearchTerm, items, setActive]);

  const handleCollapse = () => {
    setTimeout(() => {
      setCollapse(!collapse);
    }, closeDelay);
  };

  // pass function on to parent to handle state - add property to {items} to indicate Active
  return (
    renderItems.length > 0 && (
      <div className={"category-container"}>
        <div className={"category-header"} onClick={handleCollapse}>
          <h2>{category}</h2>
        </div>
        <div
          className={`category-collapsible ${collapse && "collapse"}`}
          // onClick={cancelActive}
        >
          <div className={`items-container`} ref={container}>
            {renderItems}
          </div>
        </div>
      </div>
    )
  );
};

export default Category;
