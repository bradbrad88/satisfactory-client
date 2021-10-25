import { useState, useEffect, useCallback } from "react";

const useApi = endpoint => {
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

  return { items, working, fetchItems };
};

export default useApi;
