import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import { HttpClient } from "../utilities/HttpClient";
import cogoToast from "cogo-toast";
import { Modal } from "./Modal";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";

function BankAccountDialog({ bankAccount }) {
  const [accountName, setAccountName] = useState(
    bankAccount ? bankAccount.name : ""
  );
  const [balance, setBalance] = useState(
    bankAccount ? bankAccount.balance : ""
  );
  const dialog = useDialog();

  const onCreateBankAccount = async (e) => {
    e.preventDefault();
    const body = {
      accountName,
      balance,
    };

    if (!bankAccount) {
      const { data } = await HttpClient().post("/api/bank-accounts", body);
      setAccountName("");
      setBalance("");
      cogoToast.success("Bank account created");
      dialog.close(data.response);
    } else {
      const { data } = await HttpClient().put(
        `/api/bank-accounts/${bankAccount.id}`,
        body
      );
      cogoToast.success("Bank account updated");
      dialog.close(data.response);
    }
  };

  return (
    <Modal>
      <h2>
        {bankAccount
          ? `Update Account "${bankAccount.name}"`
          : "New Bank Account"}
      </h2>

      <form onSubmit={onCreateBankAccount}>
        <FloatingTextField
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          label="Bank Account Name"
        />
        <FloatingTextField
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          label="Current Balance"
        />
        <PrimaryButton>Submit</PrimaryButton>
      </form>
    </Modal>
  );
}

export default BankAccountDialog;
