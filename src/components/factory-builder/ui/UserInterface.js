import React, { useState, useMemo } from "react";
import Category from "components/elements/fields/Category";
import NumberInput from "components/elements/fields/NumberInput";
import { ADD_NEW_ITEM } from "reducers/buildingStepsReducer";

const UserInterface = ({ items, data, dispatch }) => {
  const [item, setInitialItem] = useState(null);
  const [qty, setQty] = useState(0);

  // const { handleQuantity, handleItem, handleAddOutput } = functions;

  const itemOptions = useMemo(() => {
    if (!items) return [];
    const itemOptions = items
      .map(item => ({
        title: item.itemName,
        id: item.itemId,
      }))
      .sort((a, b) => b.title < a.title);
    itemOptions.unshift({ title: "SELECT AN ITEM", id: "" });
    return itemOptions;
  }, [items]);

  const factoryTotals = useMemo(() => {
    // console.log("factory totals building steps", [...buildingSteps]);
    const getBuildingStepOutputQty = buildingStep => {
      const outputQty = buildingStep.outputs.reduce((total, output) => {
        if (output.byProduct) return total;
        return parseFloat(output.qty) + total;
      }, 0);
      // console.log("building step output qty", outputQty);
      return outputQty;
    };

    const breakdown = data.reduce(
      (total, buildingStep) => {
        const newTotal = { ...total };
        const outputs = buildingStep.outputs.reduce((outputTotal, output) => {
          const { item, qty, type } = output;
          const newTotal = { ...outputTotal };
          const arr = newTotal[type] || [];
          // TODO - look for existing item here and add to it
          arr.push({ item, qty });
          newTotal[type] = arr;
          return newTotal;
        }, {});
        if (buildingStep.item.rawMaterial) {
          newTotal.inputs.rawMaterials = newTotal.inputs.rawMaterials || [];
          newTotal.inputs.rawMaterials.push({
            item: buildingStep.item,
            qty: getBuildingStepOutputQty(buildingStep),
          });
        } else if (buildingStep.imported) {
          newTotal.inputs.imported = newTotal.inputs.imported || [];
          newTotal.inputs.imported.push({
            item: buildingStep.item,
            qty: getBuildingStepOutputQty(buildingStep),
          });
        } else {
        }

        // see if newwTotal.ouputs already exists
        Object.keys(outputs).forEach(key => {
          const arr = outputs[key] || [];
          const existingArr = newTotal.outputs[key] || [];
          newTotal.outputs[key] = [...existingArr, ...arr];
        });
        return newTotal;
      },
      { inputs: {}, outputs: {} }
    );
    return breakdown;
  }, [data]);

  const renderTotals = useMemo(() => {
    const renderInputs = () => {
      const rawMaterial = factoryTotals.inputs.rawMaterials?.map(rawMaterial => (
        <div key={`raw-materials-${rawMaterial.item.itemId}`}>
          {rawMaterial.item.itemName}: {rawMaterial.qty}
        </div>
      ));
      const imports = factoryTotals.inputs.imported?.map(imported => (
        <div key={`imported-${imported.item.itemId}`}>
          {imported.item.itemName}: {imported.qty}
        </div>
      ));
      return (
        <>
          {rawMaterial?.length > 0 && (
            <>
              <h3>Raw Materials</h3>
              {rawMaterial}
            </>
          )}
          {imports?.length > 0 && (
            <>
              <h3>Imported</h3>
              {imports}
            </>
          )}
        </>
      );
    };

    const renderOutputs = () => {
      const store = factoryTotals.outputs.store?.map(item => (
        <div key={`store-${item.item.itemId}`}>
          {item.item.itemName}: {item.qty}
        </div>
      ));
      const sink = factoryTotals.outputs.sink?.map(item => (
        <div key={`sink-${item.item.itemId}`}>
          {item.item.itemName}: {item.qty}
        </div>
      ));
      const sinkPoints =
        factoryTotals.outputs.sink?.reduce((total, item) => {
          return item.item.points * item.qty + total;
        }, 0) || 0;
      return (
        <>
          {store?.length > 0 && (
            <>
              <h3>To Storage</h3>
              {store}
            </>
          )}
          {sink?.length > 0 && (
            <>
              <h3>To Resource Sink ({sinkPoints.toLocaleString()} points)</h3>
              {sink}
            </>
          )}
        </>
      );
    };

    return (
      <div className={"factory-totals"}>
        <div className={"analysis inputs"}>
          <h2>Inputs</h2>
          {renderInputs()}
        </div>
        <div className={"analysis outputs"}>
          <h2>Outputs</h2>
          {renderOutputs()}
        </div>
      </div>
    );
  }, [factoryTotals]);

  const handleQuantity = e => {
    setQty(e.target.value);
  };

  const handleItem = e => {
    const newItem = items.find(
      item => parseInt(item.itemId) === parseInt(e.target.value)
    );
    setInitialItem(newItem);
  };

  const handleAddOutput = () => {
    const action = {
      type: ADD_NEW_ITEM,
      payload: { type: "store", qty, item },
    };
    dispatch(action);
  };

  return (
    <div className={"ui"}>
      <Category
        label={"Select an item"}
        options={itemOptions}
        value={item?.itemId}
        onChange={handleItem}
      />
      <NumberInput
        label={"Quantity"}
        placeholder={"Items/min..."}
        handleInputChange={handleQuantity}
        value={qty}
      />
      <button onClick={handleAddOutput}>Add New Item</button>
      {renderTotals}
    </div>
  );
};

export default UserInterface;
