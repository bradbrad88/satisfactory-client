import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import Map from "./map/Map";
import UserInterface from "./ui/UserInterface";
import "stylesheets/FactoryBuilder.css";

const FactoryBuilder = () => {
  const [factoryTree, setFactoryTree] = useState({});
  const [initialItem, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);
  const { items } = useApi("items", "itemId", 0);

  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    console.log("e", e);
    setInitialItem(e.target.value);
  };

  return (
    <div className={"factory-builder"}>
      <UserInterface
        items={items}
        handleQuantity={handleQuantity}
        handleItem={handleItem}
        item={initialItem}
        qty={qty}
      />
      <Map />
    </div>
  );
};

export default FactoryBuilder;
