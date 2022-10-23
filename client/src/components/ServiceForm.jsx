import React, { useEffect, useState } from "react";
import { HttpClient } from "../utilities/HttpClient";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import Products from "../pages/Products";
import SettingsGroup from "./SettingsGroup";
import ProductsContainer from "./ProductsContainer";
import { CustomDialog, useDialog } from "react-st-modal";

const AddProductDialog = () => {
  const dialog = useDialog();

  return (
    <div className="p-4">
      <ProductsContainer
        selectableRows={false}
        selectMode
        onSelect={(product) => dialog.close(product)}
        columns={[
          {
            name: "Title",
            selector: "title",
            sortable: true,
          },
          {
            name: "SKU",
            selector: "sku",
            sortable: true,
          },
        ]}
      />
    </div>
  );
};

function ServiceForm({ row, onCreated, onUpdated }) {
  const [title, setTitle] = useState(row ? row.title : "");
  const [sku, setSku] = useState(row ? row.sku : "");
  const [error, setError] = useState({});
  const [serviceProducts, setServiceProducts] = useState(
    row ? row.serviceProducts : []
  );

  useEffect(() => {
    generateRandomSku();
  }, []);

  const onSubmit = async () => {
    setError({});
    try {
      const body = {
        title,
        sell_price: getTotalPrice(),
        serviceProducts,
        sku,
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/services", body);
        onCreated(data.content);
      } else {
        await HttpClient().put(`/api/services/${row._id}`, body);
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

  const openAddProductDialog = async () => {
    const result = await CustomDialog(<AddProductDialog />);

    if (result) {
      const rows = [...serviceProducts];
      let found = false;
      rows.forEach((x) => {
        if (x.product._id === result._id) {
          x.quantity++;
          found = true;
        }
      });

      const settedRows = found
        ? rows
        : [
            ...serviceProducts,
            {
              product: result,
              quantity: 1,
              sell_price: result.sell_price,
            },
          ];
      setServiceProducts(settedRows);
    }
  };

  const getTotalPriceForServiceProduct = (serviceProduct) => {
    const total = parseFloat(
      serviceProduct.quantity * serviceProduct.sell_price
    );

    if (isNaN(total)) return 0;

    return total;
  };

  const getTotalPrice = () => {
    let total = 0;

    serviceProducts.forEach((x) => {
      total += getTotalPriceForServiceProduct(x);
    });

    if (isNaN(total)) return 0;
    return total.toFixed(2);
  };

  const handleChangeServiceProduct = (prop, index, event) => {
    const rows = [...serviceProducts];
    rows[index][prop] = event.target.value;
    setServiceProducts(rows);
  };

  const removeServiceProduct = (index) => {
    const rows = [...serviceProducts];
    rows.splice(index, 1);
    setServiceProducts(rows);
  };

  return (
    <div style={{ position: "relative", padding: "1rem 1rem 3rem" }}>
      <h3 className="mb-4">{row ? "Update" : "Create"} Service</h3>
      <SettingsGroup title="Data" description="Service Data">
        <div className="flex flex-col gap-4">
          <FloatingTextField
            error={error.title}
            label="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-4 items-center w-full">
            <PrimaryButton onClick={generateRandomSku}>Generate</PrimaryButton>
            <FloatingTextField
              error={error.sku}
              width="100%"
              label="Service SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Products" description="Select products">
        <PrimaryButton onClick={openAddProductDialog}>
          Add Product
        </PrimaryButton>
        <div className="flex gap-1 flex-col mb-4 mt-4 w-full">
          {serviceProducts.map((serviceProduct, index) => (
            <div
              key={index}
              className="flex gap-4 justify-between relative border border-gray-500 p-4 items-center"
            >
              <span className="w-32">{serviceProduct.product?.title}</span>
              <div className="flex gap-4 items-center">
                <FloatingTextField
                  label="Quantity"
                  width="100px"
                  value={serviceProduct.quantity}
                  onChange={(e) =>
                    handleChangeServiceProduct("quantity", index, e)
                  }
                />

                <FloatingTextField
                  label="Sell Price"
                  width="100px"
                  value={serviceProduct.sell_price}
                  onChange={(e) =>
                    handleChangeServiceProduct("sell_price", index, e)
                  }
                />
                <FloatingTextField
                  width="100px"
                  label="Total Price"
                  value={getTotalPriceForServiceProduct(serviceProduct)}
                />
                <PrimaryButton
                  $mini
                  onClick={() => removeServiceProduct(index)}
                >
                  Remove
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup
        title="Total"
        description="Here you can see total price for service"
      >
        {getTotalPrice()}
      </SettingsGroup>
      <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>
    </div>
  );
}

export default ServiceForm;
