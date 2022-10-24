import React from "react";
import { Page } from "../components/Page";
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
