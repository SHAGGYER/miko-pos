import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";
import { CustomDialog, useDialog } from "react-st-modal";
import ResourceBrowser, { RESOURCE_MODE } from "./ResourceBrowser";
import ContactForm from "./ContactForm";
import SettingsGroup from "./SettingsGroup";
import ProductForm from "./ProductForm";
import { getTotal } from "../pages/Purchases";
import Select from "./Select";
import Autocomplete from "./Autocomplete";
import InvoiceLinesTable from "./InvoiceLinesTable";
import { SuccessButton } from "./SuccessButton";

const NewCustomerDialog = () => {
  const dialog = useDialog();
  return (
    <div className="p-4">
      <ContactForm onCreated={(item) => dialog.close(item)} />
    </div>
  );
};

const AddDiscountDialog = () => {
  const [sell_price, setSellPrice] = useState("");
  const [computationStyle, setComputationStyle] = useState("static");
  const dialog = useDialog();

  const addPurchase = (e) => {
    e.preventDefault();

    dialog.close({
      sell_price: parseFloat(sell_price),
      computationStyle,
      quantity: 1,
      isDiscount: true,
      product: {
        title: "Discount",
      },
    });
  };

  return (
    <div className="p-4">
      <h2>Add Discount</h2>

      <form onSubmit={addPurchase} className="flex flex-col gap-4 items-start">
        <FloatingTextField
          value={sell_price}
          onChange={(e) => setSellPrice(e.target.value)}
          label="Amount"
          width="100%"
        />

        <Select
          label="Computation Style"
          value={computationStyle}
          onChange={(e) => setComputationStyle(e.target.value)}
        >
          <option value="static">Static</option>
          <option value="percentage">Percentage</option>
        </Select>

        <PrimaryButton>Add</PrimaryButton>
      </form>
    </div>
  );
};

const FreeTextDialog = () => {
  const dialog = useDialog();
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sell_price, setSellPrice] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    dialog.close({
      product: {
        title,
      },
      quantity,
      sell_price: parseFloat(sell_price),
    });
  };

  return (
    <div className="p-4">
      <form onSubmit={onSubmit}>
        <FloatingTextField
          label="Text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FloatingTextField
          label="Sell Price"
          value={sell_price}
          onChange={(e) => setSellPrice(e.target.value)}
        />
        <FloatingTextField
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <PrimaryButton>Save</PrimaryButton>
      </form>
    </div>
  );
};

const ContactDialog = () => {
  const dialog = useDialog();

  return (
    <div className="p-4">
      <ResourceBrowser
        url="/api/contacts"
        selectMode
        modes={[RESOURCE_MODE.NEW]}
        viewComponent={ContactForm}
        onSelect={(row) => dialog.close(row)}
        createComponent={ContactForm}
        columns={[
          {
            name: "Name",
            selector: "name",
          },
          {
            name: "Email",
            selector: "email",
          },
        ]}
      />
    </div>
  );
};

const ProductDialog = () => {
  const dialog = useDialog();

  return (
    <div className="p-4">
      <ResourceBrowser
        url="/api/products"
        selectMode
        modes={[RESOURCE_MODE.NEW]}
        viewComponent={ProductForm}
        createComponent={ProductForm}
        onSelect={(row) => dialog.close(row)}
        columns={[
          {
            name: "Title",
            selector: "title",
          },
          {
            name: "SKU",
            selector: "sku",
          },
        ]}
      />
    </div>
  );
};

function CaseForm({ row, onCreated, onUpdated }) {
  const [error, setError] = useState({});
  const [lines, setLines] = useState(row ? row.lines : []);
  const [contact, setContact] = useState(row ? row.contact : null);

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    try {
      const body = {
        lines,
        contact,
        total: getTotal(lines),
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/cases", body);
        onCreated(data.content);
      } else {
        await HttpClient().put(`/api/cases/${row._id}`, body);
        onUpdated({ ...row, ...body });
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  const openProductsDialog = async () => {
    const result = await CustomDialog(<ProductDialog />);

    if (result) {
      const rows = [...lines];
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
            ...lines,
            {
              product: result,
              quantity: 1,
              sell_price: result.sell_price,
            },
          ];
      setLines(settedRows);
    }
  };

  const openFreeTextDialog = async () => {
    const result = await CustomDialog(<FreeTextDialog />);
    if (result) {
      setLines([...lines, result]);
    }
  };

  const openDiscountDialog = async () => {
    const result = await CustomDialog(<AddDiscountDialog />);
    if (result) {
      setLines([...lines, result]);
    }
  };

  const openNewCustomerDialog = async () => {
    const result = await CustomDialog(<NewCustomerDialog />);
    if (result) {
      setContact(result);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">{row ? "Update" : "Create"} Case</h2>

      <div className="flex flex-col items-start gap-4">
        <article className="w-full">
          <div className="mb-4">
            {!contact ? (
              <Autocomplete
                url="/api/contacts"
                prop="name"
                label="Select Customer"
                onSelect={(item) => setContact(item)}
                additionalComponent={
                  <PrimaryButton onClick={openNewCustomerDialog}>
                    New Contact
                  </PrimaryButton>
                }
              />
            ) : (
              <SettingsGroup title={contact.name} description={contact.email}>
                {!row?._id && (
                  <PrimaryButton
                    $mini
                    type="button"
                    onClick={() => setContact(null)}
                  >
                    Reset
                  </PrimaryButton>
                )}
              </SettingsGroup>
            )}
          </div>

          <div className="flex gap-4 items-center">
            {!row?.paidAt && (
              <>
                <PrimaryButton type="button" onClick={openProductsDialog}>
                  Add Product
                </PrimaryButton>
                <PrimaryButton type="button" onClick={openFreeTextDialog}>
                  Add Freetext
                </PrimaryButton>
                <PrimaryButton type="button" onClick={openDiscountDialog}>
                  Add Discount
                </PrimaryButton>
              </>
            )}
            {row && <SuccessButton>Make Ready</SuccessButton>}
          </div>
        </article>

        <article className="w-full">
          {!!lines.length && (
            <InvoiceLinesTable
              lines={lines}
              setLines={setLines}
              editable={!row?.paidAt}
            />
          )}
        </article>

        {!row?.paidAt && <PrimaryButton onClick={onSubmit}>Save</PrimaryButton>}
      </div>
    </div>
  );
}

export default CaseForm;
