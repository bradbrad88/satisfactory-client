import React, { useState } from "react";
import UserInput from "./UserInput";
import Factories from "./Factories";
import FactoryAnalysis from "./FactoryAnalysis";
import { useEffect } from "react/cjs/react.development";

const USER_INPUT = "USER_INPUT";
const ANALYSIS = "ANALYSIS";
const FACTORIES = "FACTORIES";

const ControlPanel = ({
  // factories,
  // activeFactory,
  // setActiveFactory,
  // items,
  // data,
  // dispatch,
  setMapState,
}) => {
  const [tab, setTab] = useState(FACTORIES);

  useEffect(() => {
    switch (tab) {
      case USER_INPUT:
        setMapState("build");
        break;
      case ANALYSIS:
        setMapState("build");
        break;
      case FACTORIES:
        setMapState("locate");
        break;
      default:
        break;
    }
  }, [tab, setMapState]);

  const componentSelector = () => {
    switch (tab) {
      case USER_INPUT:
        // setMapState("build");
        return <UserInput />;
      case ANALYSIS:
        // setMapState("build");
        return <FactoryAnalysis />;
      case FACTORIES:
        // setMapState("locate");
        return <Factories />;

      default:
        return null;
    }
  };

  const isActive = tabName => {
    if (tabName === tab) return "active";
    return "";
  };

  return (
    <div className={"ui"}>
      <div className={"ui-switches"}>
        <button
          className={`ui-switch ${isActive(FACTORIES)}`}
          onClick={() => setTab(FACTORIES)}
        >
          FACTORIES
        </button>
        <button
          className={`ui-switch ${isActive(ANALYSIS)}`}
          onClick={() => setTab(ANALYSIS)}
        >
          ANALYSIS
        </button>
        <button
          className={`ui-switch ${isActive(USER_INPUT)}`}
          onClick={() => setTab(USER_INPUT)}
        >
          USER INPUT
        </button>
      </div>
      {componentSelector()}
    </div>
  );
};

export default ControlPanel;
