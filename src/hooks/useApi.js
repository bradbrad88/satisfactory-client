import { useState, useEffect } from "react";

const useApi = ({ endpoint }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    console.log("Fetching Items");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}${endpoint}`);
      console.log(response);
      if (response.status === 200) {
        const { data } = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error using useApi", error);
    }
  };

  return items;
};

export default useApi;
