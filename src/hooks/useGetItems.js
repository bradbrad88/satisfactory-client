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
    const groupedItems = items.reduce((obj, item) => {
      const group = obj[item.transportType] || [];
      group.push({ title: item.itemName, id: item.itemId });
      obj[item.transportType] = group;
      return obj;
    }, {});
    // if (!groupedItems.pipe) groupedItems.pipe = [];
    // if (!groupedItems.conveyor) groupedItems.conveyor = [];
    let sortedItems = {};
    sortedItems.pipe = groupedItems.pipe?.sort((a, b) => b.title < a.title) || [];
    sortedItems.conveyor =
      groupedItems.conveyor?.sort((a, b) => b.title < a.title) || [];
    console.log("sorted items", sortedItems);
    sortedItems.pipe.unshift({ title: "SELECT AN ITEM", id: "" });
    sortedItems.conveyor.unshift({ title: "SELECT AN ITEM", id: "" });
    return sortedItems;
  }, [items]);

  return { items, working, itemsByTransportType };
};

export default useGetItems;
