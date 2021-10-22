import { useState } from "react";

export const useItemApi = () => {
  const [working, setWorking] = useState(false);
  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);

  const getData = async endpoint => {};
  const sendData = async (itemData, endpoint, method) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(itemData),
    };
    try {
      setWorking(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}${endpoint}`,
        options
      );
      // console.log(await response.json());
      const { data, error } = await response.json();
      if (error) {
        console.log("error in try", error);
        setWorking(false);
        return { error };
      }
      if ([200, 201, 204].includes(response.status)) {
        setWorking(false);
        return { data };
      } else {
        setWorking(false);
        return { error };
      }
    } catch (error) {
      console.log("error in catch", error);
      setWorking(false);
      return { error };
    }
  };
  const putData = (itemData, endpoint) => {};
  const deleteData = (itemData, endpoint) => {};
  const reset = () => {
    setWorking(false);
    // setData(null);
    // setError(false);
  };
  return { working, sendData };
};

// export default useItemApi;
