import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import { CustomDialog } from "react-st-modal";
import BankAccountDialog from "../components/BankAccountDialog";
import TransferMoneyDialog from "../components/TransferMoneyDialog";
import RegisterDepositDialog from "../components/RegisterDepositDialog";
import cogoToast from "cogo-toast";

const NewBankAccountContainer = styled.div`
  border: 1px solid #0c5460;
  border-radius: 7px;
  padding: 1rem;
  max-width: 600px;
  margin-bottom: 1rem;
  position: relative;
  color: #0c5460;

  background-color: ${(props) => (props.$loading ? "#eee" : "transparent")};

  h2 {
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

const EditContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 1rem;

  i {
    cursor: pointer;
    color: #0c5460;
    font-size: 20px;
  }
`;

function Accounts(props) {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBankAccounts();
  }, []);

  const getBankAccounts = async () => {
    setLoading(true);
    const { data } = await HttpClient().get("/api/bank-accounts");
    setLoading(false);
    setBankAccounts(data.content);
  };

  const openCreateBankAccountDialog = async () => {
    const result = await CustomDialog(<BankAccountDialog />);
    if (result) {
      setBankAccounts([...bankAccounts, result]);
    }
  };

  const openEditBankAccountDialog = async (account) => {
    const result = await CustomDialog(
      <BankAccountDialog bankAccount={account} />
    );
    if (result) {
      const _bankAccounts = [...bankAccounts].map((x) => {
        if (x.id === result.id) {
          return result;
        }

        return x;
      });

      setBankAccounts(_bankAccounts);
    }
  };

  const openTransferMoneyDialog = async () => {
    const result = await CustomDialog(
      <TransferMoneyDialog bankAccounts={bankAccounts} />
    );
    if (result) {
      const _bankAccounts = [...bankAccounts].map((x) => {
        if (x.id === result.fromBankAccount.id) {
          return result.fromBankAccount;
        } else if (x.id === result.toBankAccount.id) {
          return result.toBankAccount;
        }

        return x;
      });

      setBankAccounts(_bankAccounts);
    }
  };

  const openRegisterDepositDialog = async () => {
    const result = await CustomDialog(
      <RegisterDepositDialog bankAccounts={bankAccounts} />
    );
    if (result) {
      const _bankAccounts = [...bankAccounts].map((x) => {
        if (x.id === result.id) {
          return result;
        }

        return x;
      });

      setBankAccounts(_bankAccounts);
    }
  };

  const move = async (direction, bankAccount, index) => {
    const body = {
      current: {
        id: direction === "up" ? bankAccount.id : bankAccounts[index + 1].id,
        order: direction === "up" ? bankAccount.order - 1 : bankAccount.order,
      },
      other: {
        id: direction === "up" ? bankAccounts[index - 1].id : bankAccount.id,
        order: direction === "up" ? bankAccount.order : bankAccount.order + 1,
      },
    };

    const _bankAccounts = [...bankAccounts].map((x) => {
      if (x.id === body.other.id) {
        return {
          ...x,
          order: body.other.order,
        };
      } else if (x.id === body.current.id) {
        return {
          ...x,
          order: body.current.order,
        };
      }

      return x;
    });

    setBankAccounts(_bankAccounts);

    await HttpClient().post("/api/bank-accounts/move", body);
    cogoToast.success("Updated order successfully");
  };

  return (
    <Page>
      <NewBankAccountContainer>
        <h2>Bank Accounts</h2>
        <EditContainer>
          <i
            className="fa-solid fa-upload"
            onClick={openRegisterDepositDialog}
          />
          <i
            className="fa-solid fa-money-bill-transfer"
            onClick={openTransferMoneyDialog}
          />
          <i
            className="fa-solid fa-circle-plus"
            onClick={openCreateBankAccountDialog}
          />
        </EditContainer>
        {bankAccounts
          .sort((a, b) => a.order - b.order)
          .map((bankAccount, index) => (
            <NewBankAccountContainer
              key={index}
              style={{ position: "relative" }}
            >
              <EditContainer>
                {index > 0 && (
                  <i
                    className="fa-solid fa-angle-up"
                    onClick={() => move("up", bankAccount, index)}
                  />
                )}

                {index < bankAccounts.length - 1 && (
                  <i
                    className="fa-solid fa-angle-down"
                    onClick={() => move("down", bankAccount, index)}
                  />
                )}

                <i
                  className="fa-solid fa-pencil"
                  onClick={() => openEditBankAccountDialog(bankAccount)}
                />
              </EditContainer>
              <h3>{bankAccount.name}</h3>
              <h4>{bankAccount.balance}</h4>
            </NewBankAccountContainer>
          ))}
      </NewBankAccountContainer>
    </Page>
  );
}

export default Accounts;
