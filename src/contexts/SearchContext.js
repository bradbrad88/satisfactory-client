import React, { useState, useRef, useEffect, useCallback } from "react";

export const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef();

  const handleSearchTermUpdate = useCallback(() => {
    // console.log("yep", term);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
  }, [searchTerm]);

  useEffect(() => {
    handleSearchTermUpdate();
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, handleSearchTermUpdate]);

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

export default SearchProvider;
