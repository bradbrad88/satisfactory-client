import React, { useMemo } from "react";
import Category from "components/elements/fields/Category";
import NumberInput from "components/elements/fields/NumberInput";

const UserInterface = ({ items, item, qty, factoryTotals, functions }) => {
  const { handleQuantity, handleItem, handleAddOutput } = functions;

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
    // console.log("factory totals", factoryTotals);

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
          // return total + 1;
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
