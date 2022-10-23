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
            name: "Status",
            cell: (row) => {
              return <>{row.paidAt ? "Paid" : "Not yet paid"}</>;
            },
          },
          {
            name: "Contact Name",
            selector: "contact.name",
            cell: (row) => row.contact?.name,
          },
          {
            name: "Contact Email",
            selector: "contact.email",
            cell: (row) => row.contact?.email,
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
