import React, { useState, useRef, useEffect } from "react";

export const SearchContext = React.createContext();

export default ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef();
  useEffect(() => {
    handleSearchTermUpdate();
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);
  const handleSearchTermUpdate = () => {
    // console.log("yep", term);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
  };
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        debouncedSearchTerm,
        handleSearchTermUpdate,
        setSearchTerm,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
