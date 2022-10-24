import React, { useContext, useEffect, useState } from "react";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import ProductForm from "../components/ProductForm";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import ProductsContainer from "../components/ProductsContainer";
import DataTable from "react-data-table-component";
import { HttpClient } from "../utilities/HttpClient";
import ResourceBrowser, { RESOURCE_MODE } from "../components/ResourceBrowser";
import ContactForm from "../components/ContactForm";
import InvoiceForm, { INVOICE_TYPES } from "../components/InvoiceForm";
import { AppContext } from "../AppContext";

function Invoices() {
  const { shop } = useContext(AppContext);
  return (
    <Page>
      <ResourceBrowser
        title="Invoices"
        url={"/api/invoices"}
        columns={[
          {
            name: "ID",
            selector: "shortId",
          },
          {
            name: "Total",
            cell: (row) => {
              return <>{parseFloat(row.total).toFixed(2)}</>;
            },
          },
          {
            name: "Status",
            cell: (row) => {
              return <>{row.paidAt ? "Paid" : "Not yet paid"}</>;
            },
          },
          {
            name: "Type",
            cell: (row) => INVOICE_TYPES[row.type],
          },
          {
            name: "Contact Name",
            selector: "contact.name",
            cell: (row) => row.contact?.name,
          },
        ]}
        bigDialog
        modes={[RESOURCE_MODE.VIEW]}
        viewComponent={InvoiceForm}
        shop={shop}
      />
    </Page>
  );
}

export default Invoices;
