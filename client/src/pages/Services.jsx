import React from "react";
import { Page } from "../components/Page";
import ResourceBrowser, { RESOURCE_MODE } from "../components/ResourceBrowser";
import ServiceForm from "../components/ServiceForm";

function Services(props) {
  return (
    <Page>
      <ResourceBrowser
        url="/api/services"
        title="Services"
        editComponent={ServiceForm}
        createComponent={ServiceForm}
        bigDialog
        modes={[RESOURCE_MODE.UPDATE, RESOURCE_MODE.NEW]}
        columns={[
          {
            name: "Title",
            selector: "title",
          },
          {
            name: "Sell Price",
            selector: "sell_price",
            cell: (row) => {
              return row.sell_price.toFixed(2);
            },
          },
        ]}
      />
    </Page>
  );
}

export default Services;
