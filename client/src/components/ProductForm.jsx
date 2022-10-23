import React, { useEffect, useState } from "react";
import { HttpClient } from "../utilities/HttpClient";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import ResourceBrowser from "./ResourceBrowser";
import { CustomDialog, useDialog } from "react-st-modal";
import SettingsGroup from "./SettingsGroup";
import Select from "./Select";

export const PRODUCT_TYPES = {
  ABSTRACT: "abstract",
  STANDARD: "standard",
};

const StorageDialog = () => {
  const dialog = useDialog();
  return (
    <div className="p-4">
      <ResourceBrowser
        title="Storage"
        url="/api/storage"
        onSelect={(row) => dialog.close(row)}
        selectMode
        columns={[
          {
            name: "Title",
            selector: "title",
          },
        ]}
      />
    </div>
  );
};

function ProductForm({ row, onCreated, onUpdated }) {
  const [title, setTitle] = useState(row ? row.title : "");
  const [type, setType] = useState(row ? row.type : "");
  const [buy_price, setBuyPrice] = useState(row ? row.buy_price : "");
  const [sell_price, setSellPrice] = useState(row ? row.sell_price : "");
  const [quantity, setQuantity] = useState(row ? row.quantity : "");
  const [sku, setSku] = useState(row ? row.sku : "");
  const [error, setError] = useState({});
  const [selectedStorage, setSelectedStorage] = useState(null);

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
        storage: selectedStorage?._id,
        type,
      };

      if (!row) {
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

  const openStorageDialog = async () => {
    const result = await CustomDialog(<StorageDialog />);
    if (result) {
      setSelectedStorage(result);
    }
  };

  return (
    <div className="relative p-4 flex flex-col gap-4 items-start">
      <h3>{row ? "Update" : "Create"} Product</h3>

      <Select
        label="Type"
        error={error.type}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Choose One</option>
        {Object.keys(PRODUCT_TYPES).map((key, index) => (
          <option key={index} value={PRODUCT_TYPES[key]}>
            {PRODUCT_TYPES[key]}
          </option>
        ))}
      </Select>

      {type === PRODUCT_TYPES.STANDARD && (
        <div className="w-full">
          {!selectedStorage ? (
            <PrimaryButton onClick={openStorageDialog}>
              Select Storage
            </PrimaryButton>
          ) : (
            <SettingsGroup
              title={selectedStorage.title}
              description="Selected Storage"
            >
              <PrimaryButton onClick={() => setSelectedStorage(null)}>
                Reset
              </PrimaryButton>
            </SettingsGroup>
          )}
        </div>
      )}

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
