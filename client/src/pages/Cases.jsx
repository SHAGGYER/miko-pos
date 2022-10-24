import React, { useContext, useEffect, useRef, useState } from "react";
import { Page } from "../components/Page";
import ResourceBrowser, { RESOURCE_MODE } from "../components/ResourceBrowser";
import ContactForm from "../components/ContactForm";
import CaseForm from "../components/CaseForm";
import { PrimaryButton } from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

function Cases() {
  const navigate = useNavigate();
  const { purchase, setPurchase } = useContext(AppContext);

  const handlePay = (row) => {
    setPurchase({
      lines: row.lines.map((x) => {
        return {
          sell_price: x.sell_price,
          quantity: x.quantity,
          title: x.product?.title,
          isDiscount: x.isDiscount,
          computationStyle: x.computationStyle,
          product: x.product,
        };
      }),
      contact: row.contact,
      dbCase: row,
    });
    navigate("/purchases");
  };

  return (
    <Page>
      <ResourceBrowser
        url={"/api/cases"}
        columns={[
          {
            name: "ID",
            selector: "shortId",
          },
          {
            name: "Contact Name",
            cell: (row) => row.contact?.name,
          },
          {
            name: "Contact Email",
            cell: (row) => row.contact?.email,
          },
          {
            name: "Status",
            cell: (row) => {
              return <>{row.ready ? "Ready" : "Pending"}</>;
            },
          },
          {
            name: "Payment",
            cell: (row) => {
              return row.paidAt ? (
                "Paid"
              ) : (
                <PrimaryButton onClick={() => handlePay(row)}>
                  Pay
                </PrimaryButton>
              );
            },
          },
        ]}
        modes={[RESOURCE_MODE.NEW, RESOURCE_MODE.UPDATE]}
        createComponent={CaseForm}
        editComponent={CaseForm}
        bigDialog
      />
    </Page>
  );
}

export default Cases;
