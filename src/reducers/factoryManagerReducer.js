import { v4 as uuidv4 } from "uuid";

export const ADD_NEW_FACTORY = "ADD_NEW_FACTORY";
export const SET_FACTORY_NAME = "SET_FACTORY_NAME";
export const SET_FACTORY_LOCATION = "SET_FACTORY_LOCATION";

const _getFactoryById = (state, factoryId) => {
  const factory = state.find(({ id }) => id === factoryId);
  if (!factory) return null;
  return factory;
};

const addNewFactory = state => {
  const updatedState = [...state];
  const newFactory = {
    id: uuidv4(),
    factoryName: "New Factory",
    location: { x: 20, y: 50 },
    buildingSteps: [],
  };
  updatedState.push(newFactory);
  return updatedState;
};

const setFactoryName = (state, payload) => {
  const updatedState = [...state];
  const { factoryId, factoryName } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  factory.factoryName = factoryName;
  return updatedState;
};

const setFactoryLocation = (state, payload) => {
  let updatedState = [...state];
  const { factoryId, location } = payload;
  const factory = _getFactoryById(updatedState, factoryId);
  factory.location = location;
  return updatedState;
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FACTORY_NAME:
      return setFactoryName(state, payload);
    case ADD_NEW_FACTORY:
      return addNewFactory(state);
    case SET_FACTORY_LOCATION:
      return setFactoryLocation(state, payload);
    default:
      return state;
  }
};

export default reducer;
