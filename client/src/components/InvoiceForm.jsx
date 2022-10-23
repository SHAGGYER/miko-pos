import React, { useContext, useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import ResourceBrowser, { RESOURCE_MODE } from "./ResourceBrowser";
import { CustomDialog, useDialog } from "react-st-modal";
import { HttpClient } from "../utilities/HttpClient";
import SettingsGroup from "./SettingsGroup";
import ContactForm from "./ContactForm";
import moment from "moment";

const SelectContactDialog = () => {
  const dialog = useDialog();
  return (
    <div className="p-4">
      <ResourceBrowser
        url="/api/contacts"
        selectMode
        bigDialog={false}
        onSelect={(row) => dialog.close(row)}
        modes={[RESOURCE_MODE.NEW]}
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

function InvoiceForm({ row, shop, mode, total, onInvoiceGenerated }) {
  const [lines, setLines] = useState(row ? row.lines : []);
  const [selectedContact, setSelectedContact] = useState(
    row ? row.contact : null
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState({});
  const [usedTotal, setUsedTotal] = useState(total ? total : row.total);
  const [usedRow, setUsedRow] = useState(row ? row : undefined);

  const openContactDialog = async () => {
    const result = await CustomDialog(<SelectContactDialog />);
    if (result) {
      setSelectedContact(result);
    }
  };

  const generateInvoice = async () => {
    setSaveLoading(true);
    try {
      await HttpClient().post("/api/invoices/generate-invoice", {
        lines,
        contact: selectedContact,
        total: usedTotal,
      });
      setSaveLoading(false);
      onInvoiceGenerated();
    } catch (e) {
      setError(e?.response?.data.errors);
      setSaveLoading(false);
    }
  };

  const sendInvoice = async () => {
    const body = {
      email: usedRow?.contact?.email,
      attachments: [
        {
          path:
            import.meta.env.VITE_SERVER_URL + "/invoices/" + usedRow.fileName,
        },
      ],
    };

    await HttpClient().post("/api/invoices/send-invoice", body);
  };

  const viewInvoice = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/invoices/${usedRow.fileName}`,
      "_blank"
    );
  };

  const registerPayment = async () => {
    const paidAt = moment().format("YYYY-MM-DD");
    await HttpClient().put(`/api/invoices/${usedRow._id}`, { paidAt });
    setUsedRow({ ...usedRow, paidAt });
  };

  return (
    <div>
      {usedRow.paidAt && (
        <div className="mb-4 bg-green-300 p-4">
          <span>
            Paid at:{" "}
            <span className="font-bold">
              {moment(usedRow.paidAt).format("DD-MM-YYYY k:mm")}
            </span>
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        {!selectedContact ? (
          <div className="flex flex-col gap-4">
            <PrimaryButton onClick={openContactDialog}>
              Select Contact
            </PrimaryButton>
            {error.contact && (
              <div className="border border-red-500 bg-red-300 p-4">
                {error.contact}
              </div>
            )}
          </div>
        ) : (
          <div className="w-64">
            <SettingsGroup
              title={selectedContact.name}
              description={selectedContact.email}
            >
              {mode !== RESOURCE_MODE.VIEW && (
                <PrimaryButton onClick={() => setSelectedContact(null)}>
                  Reset
                </PrimaryButton>
              )}
            </SettingsGroup>
          </div>
        )}
        <div className="w-64">
          <SettingsGroup
            right
            title={shop?.title}
            description={"test@email.com"}
          >
            <div className="text-right">
              <p>Højstrupvej 40b, 1th</p>
              <p>Odense 5200</p>
              <p>Denmark</p>
            </div>
          </SettingsGroup>
        </div>
      </div>

      <SettingsGroup
        title="Invoice Lines"
        description="Here are the invoice lines"
      >
        <div className="flex flex-col border border-gray-500 p-4 mt-4 mb-4">
          {lines.map((line, index) => (
            <div key={index} className="w-full flex justify-between">
              <span>{line.title}</span>
              <span>
                {line.isDiscount && line.computationStyle === "percentage" ? (
                  <>{line.sell_price}%</>
                ) : (
                  <>{line.sell_price.toFixed(2)}</>
                )}
              </span>
            </div>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup title="Total" description="Here goes the total">
        <span>{usedTotal.toFixed(2)}</span>
      </SettingsGroup>

      {mode !== RESOURCE_MODE.VIEW && (
        <PrimaryButton disabled={saveLoading} onClick={generateInvoice}>
          {saveLoading && <i className="fa-solid fa-spinner fa-spin"></i>}
          <span>Save</span>
        </PrimaryButton>
      )}

      {mode === RESOURCE_MODE.VIEW && (
        <div className="flex gap-1">
          <PrimaryButton onClick={sendInvoice}>
            Send Invoice on Email
          </PrimaryButton>
          <PrimaryButton onClick={viewInvoice}>View PDF</PrimaryButton>
          {!usedRow.paidAt && (
            <PrimaryButton onClick={registerPayment}>
              Register Payment
            </PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
}

export default InvoiceForm;
