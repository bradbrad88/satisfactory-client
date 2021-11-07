import { useState, useEffect, useCallback } from "react";

const useApi = (endpoint, key, animationTime) => {
  const [items, setItems] = useState([]);
  const [working, setWorking] = useState(true);
  const processBuildingData = useCallback(data => {
    data.forEach(building => {
      building.input = buildingInputs(building.BuildingInputs, "input");
      building.output = buildingInputs(building.BuildingInputs, "output");
    });
  }, []);
  const fetchItems = useCallback(async () => {
    if (!endpoint) return;
    setWorking(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/${endpoint}`);
      if ([200, 201, 304].includes(response.status)) {
        const { data } = await response.json();
        if (endpoint === "buildings") processBuildingData(data);
        if (endpoint === "recipes") processRecipeData(data);
        setItems(data);
      }
    } catch (error) {
      console.error("Error using useApi", error);
    }
  }, [endpoint, processBuildingData]);
  useEffect(() => {
    fetchItems().then(() => {
      setWorking(false);
    });
  }, [fetchItems, endpoint]);

  const buildingInputs = (buildingInputs, direction) => {
    const inputs = buildingInputs.reduce((total, input) => {
      if (input.direction !== direction) return total;
      const arr = [];
      for (let i = 0; i < input.amount; i++) {
        const { buildingInputId, direction, type } = input;
        arr.push({ key: `${buildingInputId}${i}`, direction, type });
      }
      return total.concat(arr);
    }, []);
    return inputs;
  };

  const processRecipeData = data => {
    data.forEach(recipe => {
      recipe.RecipeItems.forEach(item => {
        item.type = item.Item?.transportType;
      });
    });
  };

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
