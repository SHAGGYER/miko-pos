import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import { HttpClient } from "../utilities/HttpClient";
import cogoToast from "cogo-toast";
import { Modal } from "./Modal";
import Select from "./Select";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";

function TransferMoneyDialog({ bankAccounts }) {
  const [amount, setAmount] = useState("");
  const [accountFromId, setAccountFromId] = useState("");
  const [accountToId, setAccountToId] = useState("");
  const dialog = useDialog();

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      fromId: accountFromId,
      toId: accountToId,
      amount,
    };

    const { data } = await HttpClient().post(
      "/api/bank-accounts/transfer-money",
      body
    );
    cogoToast.success("Transferred money successfully");
    dialog.close(data);
  };

  return (
    <Modal>
      <h2>Transfer Money</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Select
            label="From Bank Account"
            value={accountFromId}
            onChange={(e) => setAccountFromId(e.target.value)}
          >
            <option value="">Choose One</option>
            {bankAccounts.map((account, index) => (
              <option value={account.id} key={index}>
                {account.name}
              </option>
            ))}
          </Select>
          <i className="fa-solid fa-angles-right"></i>
          <Select
            label="To Bank Account"
            value={accountToId}
            onChange={(e) => setAccountToId(e.target.value)}
          >
            <option value="">Choose One</option>
            {bankAccounts.map((account, index) => (
              <option value={account.id} key={index}>
                {account.name}
              </option>
            ))}
          </Select>
        </div>
        <FloatingTextField
          value={amount}
          label="Amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <PrimaryButton>Save</PrimaryButton>
      </form>
    </Modal>
  );
}

export default TransferMoneyDialog;
