import React, { useContext, useEffect, useState } from "react";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import ProductForm from "../components/ProductForm";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import ProductsContainer from "../components/ProductsContainer";
import DataTable from "react-data-table-component";
import { HttpClient } from "../utilities/HttpClient";
import ResourceBrowser from "../components/ResourceBrowser";
import ContactForm from "../components/ContactForm";
import InvoiceForm from "../components/InvoiceForm";
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
            name: "Contact Name",
            selector: "contact.name",
          },
          {
            name: "Contact Email",
            selector: "contact.email",
          },
        ]}
        createComponent={InvoiceForm}
        editComponent={InvoiceForm}
        viewComponent={InvoiceForm}
        shop={shop}
      />
    </Page>
  );
}

export default Invoices;
