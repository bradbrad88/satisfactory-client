import { useState, useEffect, useMemo } from "react";

const useGetItems = () => {
  const [items, setItems] = useState([]);
  const [working, setWorking] = useState(false);
  useEffect(() => {
    getItems();
  }, []);
  const getItems = async () => {
    try {
      setWorking(true);
      const res = await fetch(`${process.env.REACT_APP_API_HOST}/items`);
      if (res.status === 200) {
        const { data } = await res.json();
        setItems(data);
        setWorking(false);
      }
    } catch (error) {
      setWorking(false);
    }
  };

  const itemsByTransportType = useMemo(() => {
    if (!items) return [];
    const sortedItems = items.reduce((obj, item) => {
      const group = obj[item.transportType] || [];
      group.push({ title: item.itemName, id: item.itemId });
      obj[item.transportType] = group;
      return obj;
    }, {});
    if (!sortedItems.pipe) sortedItems.pipe = [];
    if (!sortedItems.conveyor) sortedItems.conveyor = [];
    sortedItems.pipe.push({ title: "SELECT AN ITEM", id: "" });
    sortedItems.conveyor.push({ title: "SELECT AN ITEM", id: "" });
    return sortedItems;
  }, [items]);

  return { items, working, itemsByTransportType };
};

export default useGetItems;
