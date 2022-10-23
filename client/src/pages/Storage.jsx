import React, { useContext, useEffect, useState } from "react";
import { Page } from "../components/Page";
import ResourceBrowser, { RESOURCE_MODE } from "../components/ResourceBrowser";
import { AppContext } from "../AppContext";
import StorageForm from "../components/StorageForm";

function Storage() {
  const { shop } = useContext(AppContext);
  return (
    <Page>
      <ResourceBrowser
        title="Storage"
        url={"/api/storage"}
        modes={[RESOURCE_MODE.UPDATE, RESOURCE_MODE.NEW]}
        columns={[
          {
            name: "Title",
            selector: "title",
          },
        ]}
        createComponent={StorageForm}
        editComponent={StorageForm}
        viewComponent={StorageForm}
        shop={shop}
      />
    </Page>
  );
}

export default Storage;
