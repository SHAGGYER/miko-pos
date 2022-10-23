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

function Contacts() {
  return (
    <Page>
      <ResourceBrowser
        title="Contacts"
        url={"/api/contacts"}
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
        modes={[RESOURCE_MODE.NEW, RESOURCE_MODE.UPDATE]}
        createComponent={ContactForm}
        editComponent={ContactForm}
      />
    </Page>
  );
}

export default Contacts;
