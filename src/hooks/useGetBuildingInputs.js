import { useState, useEffect } from "react";

const useGetBuildingInputs = buildingId => {
  const [buildingInputs, setBuildingInputs] = useState([]);
  const [working, setWorking] = useState(false);
  useEffect(() => {
    getBuildingInputs();
  }, [buildingId]);
  const getBuildingInputs = async () => {
    try {
      setWorking(true);
      const options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ buildingId }),
      };
      const url = `${process.env.REACT_APP_API_HOST}/building/${buildingId}`;
      const res = await fetch(url);
      if (res.status === 200) {
        const { data } = await res.json();
        setBuildingInputs(data.BuildingInputs);
        setWorking(false);
      }
      setWorking(false);
    } catch (error) {
      console.log("errror", error);
      setWorking(false);
    }
  };
  return { buildingInputs, working };
};
export default useGetBuildingInputs;
