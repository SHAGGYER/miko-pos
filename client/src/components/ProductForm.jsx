import React, { useEffect, useState } from "react";
import { HttpClient } from "../utilities/HttpClient";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";

function ProductForm({ row, onCreated, onUpdated }) {
  const [title, setTitle] = useState(row ? row.title : "");
  const [buy_price, setBuyPrice] = useState(row ? row.buy_price : "");
  const [sell_price, setSellPrice] = useState(row ? row.sell_price : "");
  const [quantity, setQuantity] = useState(row ? row.quantity : "");
  const [sku, setSku] = useState(row ? row.sku : "");
  const [error, setError] = useState({});

  useEffect(() => {
    if (!sku) {
      generateRandomSku();
    }
  }, [sku]);

  const onSubmit = async () => {
    setError({});
    try {
      const body = {
        title,
        buy_price: parseFloat(buy_price),
        sell_price: parseFloat(sell_price),
        quantity,
        sku,
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/products", body);
        onCreated(data.content);
      } else {
        await HttpClient().put(`/api/products/${row._id}`, body);
        onUpdated({ ...row, ...body });
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  const generateRandomSku = async () => {
    const { data } = await HttpClient().get("/api/products/random-sku");
    setSku(data.content);
  };

  return (
    <div className="relative p-4 flex flex-col gap-4 items-start">
      <h3>{row ? "Update" : "Create"} Product</h3>
      <FloatingTextField
        error={error.title}
        label="Product Title"
        value={title}
        width="100%"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex gap-4 items-end w-full">
        <PrimaryButton onClick={generateRandomSku}>Generate</PrimaryButton>
        <FloatingTextField
          error={error.sku}
          label="Product SKU"
          value={sku}
          width="100%"
          onChange={(e) => setSku(e.target.value)}
        />
      </div>
      <FloatingTextField
        error={error.buy_price}
        width="100%"
        label="Product Buy Price"
        value={buy_price}
        onChange={(e) => setBuyPrice(e.target.value)}
      />
      <FloatingTextField
        error={error.sell_price}
        label="Product Sell Price"
        width="100%"
        value={sell_price}
        onChange={(e) => setSellPrice(e.target.value)}
      />
      <FloatingTextField
        width="100%"
        error={error.quantity}
        label="Product Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>
    </div>
  );
}

export default ProductForm;
