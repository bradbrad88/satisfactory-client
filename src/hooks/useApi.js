import { useState, useEffect, useCallback } from "react";

const useApi = (endpoint, key, animationTime) => {
  const [items, setItems] = useState([]);
  const [working, setWorking] = useState(true);
  const fetchItems = useCallback(async () => {
    if (!endpoint) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/${endpoint}`);
      if ([200, 201, 304].includes(response.status)) {
        const { data } = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error using useApi", error);
    }
  }, [endpoint]);
  useEffect(() => {
    if (working) {
      fetchItems().then(() => {
        setWorking(false);
      });
    }
  }, [fetchItems]);

  const setActiveItem = (activeItem, active) => {
    setItems(prevState => {
      if (!activeItem) return prevState.map(item => ({ ...item, active: false }));
      return prevState.map(item => ({
        ...item,
        active: activeItem[key] === item[key] ? active : false,
      }));
    });
  };

  const addNewItem = newItem => {
    setItems(prevState => [...prevState, newItem]);
  };

  const editItem = editedItem => {
    console.log("edited item", editedItem);
    setTimeout(() => {
      setItems(prevState =>
        prevState.map(item => (editedItem[key] === item[key] ? editedItem : item))
      );
    }, animationTime);
  };

  const deleteItem = deletedItem => {
    setItems(prevState => prevState.filter(item => item[key] !== deletedItem[key]));
  };

  return { items, working, setActiveItem, addNewItem, editItem, deleteItem };
};

export default useApi;
