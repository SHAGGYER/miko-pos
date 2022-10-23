import React, { useContext, useEffect, useState } from "react";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import ProductForm from "../components/ProductForm";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import ProductsContainer from "../components/ProductsContainer";
import ResourceBrowser, { RESOURCE_MODE } from "../components/ResourceBrowser";

function Products({ selectMode, onSelected, ...props }) {
  const [columns, setColumns] = useState([
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Storage",
      selector: "storage.title",
      sortable: false,
    },
    {
      name: "SKU",
      selector: "sku",
      sortable: true,
    },
    {
      name: "Sell Price",
      selector: "sell_price",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: "quantity",
      sortable: true,
    },
    /*    {
      name: "Created At",
      selector: "createdAt",
      sortable: true,
      format: (row) => moment(row.createdAt).format("DD-MM-YYYY"),
    },*/
  ]);

  return (
    <Page>
      <ResourceBrowser
        url="/api/products"
        title="Products"
        createComponent={ProductForm}
        editComponent={ProductForm}
        columns={columns}
        modes={[RESOURCE_MODE.UPDATE, RESOURCE_MODE.NEW]}
      />
    </Page>
  );
}

export default Products;
