import React, { useEffect, useRef, useState } from "react";
import useApi from "../../hooks/useApi";

const Haveacrack = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { items } = useApi("recipes", "recipeId", 0);
  const debounceTimer = useRef();
  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);
  const handleSearchChange = e => {
    clearTimeout(debounceTimer.current);
    setSearchTerm(e.target.value);
    debounceTimer.current = setTimeout(() => {
      doTheThing();
    }, 500);
  };

  const doTheThing = () => {
    console.log("did the thing", items);
  };

  return (
    <div>
      <label>
        Search <input type="text" onChange={handleSearchChange} value={searchTerm} />
      </label>
    </div>
  );
};

export default Haveacrack;
