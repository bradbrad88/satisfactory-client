import React, { useMemo, useReducer, useState } from "react";
import FactoryBuilder from "./FactoryBuilder";
import factoryManagerReducer from "reducers/factoryManagerReducer";
import { v4 as uuidv4 } from "uuid";

const dummyFactories = [
  {
    id: uuidv4(),
    factoryName: "Dune Factory",
    buildingSteps: [],
    location: { x: 20, y: 25 },
  },
  {
    id: uuidv4(),
    factoryName: "Iron Factory",
    buildingSteps: [],
    location: { x: 30, y: 25 },
  },
];

const FactoryManager = () => {
  const [factories, dispatch] = useReducer(factoryManagerReducer, dummyFactories);
  const [activeFactoryId, setActiveFactoryId] = useState(null);

  const activeFactory = useMemo(() => {
    return factories.find(({ id }) => id === activeFactoryId);
  }, [activeFactoryId]);

  return (
    <FactoryBuilder
      factories={factories}
      activeFactory={activeFactory}
      setActiveFactory={setActiveFactoryId}
      dispatch={dispatch}
    />
  );
};

export default FactoryManager;
