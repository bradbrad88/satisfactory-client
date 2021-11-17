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
        <div>
          {rawMaterial.item.itemName}: {rawMaterial.qty}
        </div>
      ));
      const imports = factoryTotals.inputs.imported?.map(imported => (
        <div>
          {imported.item.itemName}: {imported.qty}
        </div>
      ));
      return (
        <>
          <h3>Raw Materials</h3>
          {rawMaterial}
          <h3>Imported</h3>
          {imports}
        </>
      );
    };
    console.log("factory totals", factoryTotals);

    const renderOutputs = () => {
      const store = factoryTotals.outputs.store?.map(item => (
        <div>
          {item.item.itemName}: {item.qty}
        </div>
      ));
      return (
        <>
          <h3>To Storage</h3>
          {store}
        </>
      );
    };

    return (
      <div className={"factory-totals"}>
        <div className={"analysis inputs"}>{renderInputs()}</div>
        <div className={"analysis outputs"}>{renderOutputs()}</div>
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
