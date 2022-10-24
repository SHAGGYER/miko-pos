import React from "react";
import { PrimaryButton } from "./PrimaryButton";
import { getTotal } from "../pages/Purchases";

function InvoiceLinesTable({ lines, setLines, editable }) {
  const getLineTotal = (line) => {
    let total = 0;

    total += line.quantity * line.sell_price;

    if (isNaN(total)) return 0;

    return total;
  };
  const removeLine = (index) => {
    const _lines = [...lines];
    _lines.splice(index, 1);
    setLines(_lines);
  };

  const handleChangeLine = (prop, value, index) => {
    const _lines = [...lines];
    _lines[index][prop] = value;
    setLines(_lines);
  };
  return (
    <table className="border-collapse border border-gray-300 p-4 mt-4 w-full">
      <thead>
        <tr>
          <td className="p-4 font-bold">Product Title</td>
          <td className="p-4 font-bold">Sell Price</td>
          <td className="p-4 font-bold">Quantity</td>
          <td className="p-4 font-bold">Total</td>
          {editable && <td className="p-4 font-bold">Action</td>}
        </tr>
      </thead>
      <tbody>
        {lines.map((line, index) => (
          <tr className="border border-gray-300" key={index}>
            <td className="p-4">{line.product?.title}</td>
            <td className="p-4">
              {line.isDiscount && line.computationStyle === "percentage" ? (
                <span>{line.sell_price}%</span>
              ) : (
                line.sell_price.toFixed(2)
              )}
            </td>
            <td className="p-4">
              {editable ? (
                <input
                  type="text"
                  className="p-2 border border-gray-300 w-16"
                  value={line.quantity}
                  onChange={(e) =>
                    handleChangeLine("quantity", e.target.value, index)
                  }
                />
              ) : (
                line.quantity
              )}
            </td>
            <td className="p-4">{getLineTotal(line).toFixed(2)}</td>
            {editable && (
              <td className="p-4">
                <PrimaryButton type="button" onClick={() => removeLine(index)}>
                  Delete
                </PrimaryButton>
              </td>
            )}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={editable ? 4 : 3}></td>
          <td className="p-4" colSpan={1}>
            <span>Total: {getTotal(lines).toFixed(2)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

export default InvoiceLinesTable;
