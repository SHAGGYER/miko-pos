import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import { HttpClient } from "../utilities/HttpClient";
import cogoToast from "cogo-toast";
import { Modal } from "./Modal";
import Select from "./Select";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";

function RegisterDepositDialog({ bankAccounts }) {
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const dialog = useDialog();

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    const _error = {};

    if (!accountId) _error.accountId = "You must choose an account";
    if (!amount) _error.amount = "You must write an amount";

    if (Object.keys(_error).length) {
      setError(_error);
      return;
    }

    const body = {
      id: accountId,
      amount,
    };

    const { data } = await HttpClient().post(
      "/api/bank-accounts/register-deposit",
      body
    );
    cogoToast.success("Deposited successfully");
    dialog.close(data.response);
  };

  return (
    <Modal>
      <h2>Register Deposit</h2>
      <form onSubmit={onSubmit}>
        <Select
          label="Bank Account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          error={error.accountId}
        >
          <option value="">Choose One</option>
          {bankAccounts.map((account, index) => (
            <option value={account.id} key={index}>
              {account.name}
            </option>
          ))}
        </Select>
        <FloatingTextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={error.amount}
        />
        <PrimaryButton>Save</PrimaryButton>
      </form>
    </Modal>
  );
}

export default RegisterDepositDialog;
