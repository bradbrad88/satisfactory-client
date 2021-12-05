import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import FactoryLayout from "./FactoryLayout";
import FactoryLocations from "./FactoryLocations";
import {
  ADD_NEW_ITEM,
  BYPRODUCT_DROPPED_ON_MAP,
  INPUT_DROPPED_ON_MAP,
} from "reducers/buildingStepsReducer";
import BuildingRow from "./BuildingRow";
import { centreMap as centreIcon } from "utils/SvgIcons";
import RecipeSelector from "./RecipeSelector";

// import BuildingStep from "./BuildingStep";

const Map = ({
  data,
  factories,
  activeFactory,
  setActiveFactory,
  recipes,
  dispatch,
  mapState,
}) => {
  // Item that appears when dragging an input indicating new step to be created

  // The temp item's intended position
  // const [tempPosition, setTempPosition] = useState(0);
  // Used in by-product drag&drop to display available recipes to build from by-product
  // const [upstreamRecipeSelector, setUpstreamRecipeSelector] = useState(null);
  // const byProductRef = useRef();
  // TODO - highlight related inputs/outputs based on the active items
  // const [activeItem] = useState(null);
  // Related to moving the map
  const [dragging, setDragging] = useState(false);
  const [initialMouse, setInitialMouse] = useState({});
  const [mapOffset, setMapOffset] = useState({ v: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const endOffset = useRef({ v: 0, h: 0 });
  // Handles moving the map when dragging an input/output item - the ref holds an interval function
  const scrollRef = useRef();

  const onMouseUp = useCallback(() => {
    setDragging(false);
    endOffset.current = mapOffset;
  }, [setDragging, mapOffset]);

  const onMouseDown = useCallback(
    e => {
      const { clientX, clientY } = e;
      setDragging(true);
      setInitialMouse({ clientX, clientY });
    },
    [setDragging, setInitialMouse]
  );

  const onMouseMove = useCallback(
    e => {
      if (!dragging) return;
      const { clientX, clientY } = e;
      const v = clientY - initialMouse.clientY + endOffset.current.v;
      const h = clientX - initialMouse.clientX + endOffset.current.h;
      setMapOffset({ v, h });
    },
    [initialMouse, dragging]
  );

  // const updateDomPosition = useCallback(ref => {
  //   console.log("ref", ref.getBoundingClientRect());
  // }, []);

  // const setTempNull = () => {
  //   setTempItem(null);
  // };

  // const handleActiveItem = () => {};

  // const buildingRows = useMemo(() => {
  //   if (!data) return null;
  //   const buildingRows = data.reduce((total, buildingStep) => {
  //     const arr = total[buildingStep.ver] || [];
  //     arr.push(buildingStep);
  //     total[buildingStep.ver] = arr;
  //     return total;
  //   }, {});
  //   Object.keys(buildingRows).forEach(key => {
  //     buildingRows[key].sort((a, b) => a.hor - b.hor);
  //   });

  //   const renderBuildingRows = Object.keys(buildingRows).map(key => (
  //     <BuildingRow
  //       data={buildingRows[key]}
  //       recipes={recipes}
  //       key={key}
  //       dispatch={dispatch}
  //       inputDrag={onInputDrag}
  //       updateDomPosition={updateDomPosition}
  //       tempStep={tempItem?.row === parseInt(key) ? tempItem : null}
  //       setTempPosition={i => setTempPosition(i)}
  //       setTempNull={setTempNull}
  //       activeItem={activeItem}
  //       setActiveItem={handleActiveItem}
  //     />
  //   ));
  //   if (tempItem && !buildingRows[tempItem.row]) {
  //     renderBuildingRows.push(
  //       <BuildingRow
  //         tempStep={tempItem}
  //         data={[]}
  //         setTempPosition={i => setTempPosition(i)}
  //       />
  //     );
  //   }
  //   return renderBuildingRows;
  // }, [data, dispatch, tempItem, updateDomPosition, activeItem, recipes]);

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseUp, onMouseMove]);

  // if (typeof data !== "object") return null;
  // if (data.length < 1) return null;

  const preventScroll = () => {
    window.addEventListener("scroll", preventScrollListener);
  };

  const enableScroll = () => {
    window.removeEventListener("scroll", preventScrollListener);
  };

  const preventScrollListener = e => {
    e.preventDefault();
  };

  const onWheel = e => {
    const STEP = 0.04;
    const { deltaY } = e;
    if (deltaY < 0) return setZoom(zoom + STEP);
    if (deltaY > 0) {
      let newZoom = zoom - STEP;
      if (newZoom < 0.1) newZoom = 0.1;
      setZoom(newZoom);
    }
  };

  // const onDragOver = e => {
  //   e.preventDefault();
  //   // console.log("e", e);
  //   try {
  //     const dragData = e.dataTransfer.getData("text/plain");
  //     const item = JSON.parse(dragData);
  //     if (item.fromInput)
  //       setTempItem({ ...item, position: { x: e.clientX, y: e.clientY } });
  //   } catch (error) {
  //     setTempItem(null);
  //   }
  // };

  // const onDragLeave = e => {
  //   // setTempItem(null);
  // };

  // const onDrop = e => {
  //   e.preventDefault();
  //   try {
  //     const dragData = e.dataTransfer.getData("text/plain");
  //     const parsedData = JSON.parse(dragData);
  //     if (parsedData.fromInput) {
  //       e.stopPropagation();
  //       handleInputDrop(parsedData);
  //     }
  //     if (parsedData.fromByProduct) {
  //       const { clientX, clientY } = e;
  //       const { offsetLeft, offsetTop } = e.target;
  //       handleByProductDrop(parsedData, {
  //         x: clientX - offsetLeft,
  //         y: clientY - offsetTop,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleInputDrop = inputData => {
  //   const type = INPUT_DROPPED_ON_MAP;
  //   const payload = {
  //     inputData,
  //   };
  //   dispatch({ type, payload });
  //   setTempItem(null);
  // };

  // const handleByProductDrop = (byProductData, location) => {
  //   const { itemId, buildingStepId } = byProductData;
  //   const relevantRecipes = recipes.filter(recipe => {
  //     const recipeItems = recipe.RecipeItems.filter(recipeItem => {
  //       return (
  //         recipeItem.direction === "input" &&
  //         recipeItem.item.itemId === parseInt(byProductData.itemId)
  //       );
  //     });
  //     return recipeItems.length > 0;
  //   });
  //   console.log("by product data", byProductData);
  //   // byProductRef.current = { buildingStepId, itemId };
  //   setUpstreamRecipeSelector({ recipes: relevantRecipes, location, byProductData });
  // };

  // const handleByProductUpstream = (recipe, byProduct) => {
  //   // console.log("handler", things);
  //   const type = BYPRODUCT_DROPPED_ON_MAP;
  //   const payload = {
  //     // ...byProductRef.current,
  //     ...byProduct,
  //     recipe,
  //   };
  //   dispatch({ type, payload });
  // };

  const onDragEnterScroll = direction => {
    scrollRef.current = setInterval(
      () => {
        let stateHandler;
        const setState = stateHandler => {
          setMapOffset(prevState => {
            const newState = stateHandler(prevState);
            endOffset.current = newState;
            return newState;
          });
        };
        switch (direction) {
          case "LEFT":
            stateHandler = state => {
              return {
                ...state,
                h: state.h + 10,
              };
            };
            return setState(stateHandler);
          case "RIGHT":
            stateHandler = state => {
              return {
                ...state,
                h: state.h - 10,
              };
            };
            return setState(stateHandler);
          case "UP":
            stateHandler = state => {
              return {
                ...state,
                v: state.v + 10,
              };
            };
            return setState(stateHandler);
          case "DOWN":
            stateHandler = state => {
              return {
                ...state,
                v: state.v - 10,
              };
            };
            return setState(stateHandler);
          default:
            break;
        }
      },
      5,
      direction
    );
  };

  const onDragLeaveScroll = () => {
    clearInterval(scrollRef.current);
  };

  const style = () => {
    return {
      // left: "50%",
      // top: "0",
      transform: `translate(-50%, -50%) translate(${mapOffset.h}px, ${mapOffset.v}px) scale(${zoom})`,
    };
  };

  const centreMap = () => {
    endOffset.current = { v: 0, h: 0 };
    setMapOffset({ v: 0, h: 0 });
  };

  return (
    <>
      <div
        className={"map"}
        onMouseEnter={preventScroll}
        onMouseLeave={enableScroll}
        onMouseDown={onMouseDown}
        onWheel={onWheel}
        // onDragOver={onDragOver}
        // onDragLeave={onDragLeave}
        // onDrop={onDrop}
      >
        {/* {tempItem && <div>{tempItem.itemName}</div>} */}
        <div
          className="scroll top"
          onDragEnter={() => onDragEnterScroll("UP")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll right"
          onDragEnter={() => onDragEnterScroll("RIGHT")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll bottom"
          onDragEnter={() => onDragEnterScroll("DOWN")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className="scroll left"
          onDragEnter={() => onDragEnterScroll("LEFT")}
          onDragLeave={onDragLeaveScroll}
          onDrop={onDragLeaveScroll}
        ></div>
        <div
          className={"centre-map"}
          style={{
            position: "absolute",
            zIndex: "3",
            cursor: "pointer",
            top: "1rem",
            left: "1rem",
          }}
          onClick={centreMap}
        >
          {centreIcon(36)}
        </div>
        <div className={"map-content"} style={style()}>
          {mapState === "build" && (
            <FactoryLayout data={data} recipes={recipes} dispatch={dispatch} />
          )}
          {mapState === "locate" && (
            <FactoryLocations
              factories={factories}
              activeFactory={activeFactory}
              setActiveFactory={setActiveFactory}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Map;
