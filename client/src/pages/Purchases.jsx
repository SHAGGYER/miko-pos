import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import { PrimaryButton } from "../components/PrimaryButton";
import { CustomDialog, useDialog } from "react-st-modal";
import { Modal } from "../components/Modal";
import FloatingTextField from "../components/FloatingTextField";
import cogoToast from "cogo-toast";
import InvoiceForm from "../components/InvoiceForm";
import { AppContext } from "../AppContext";

const items = [
  {
    _id: 1,
    title: "Custom",
    isCustom: true,
  },
];

const SearchInput = styled.input`
  border: 1px solid black;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 100%;
`;

const TotalContainer = styled.article`
  min-width: 500px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  h2 {
    font-size: 35px;
    margin-bottom: 1rem;
  }

  ul {
    flex: 1;
    list-style-type: none;
    overflow-y: auto;
    margin-bottom: 1rem;

    li {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 0.5rem;

      i {
        color: #de1511;
        cursor: pointer;
      }
    }
  }

  article {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Box = styled.div`
  width: 300px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  user-select: none;

  &:hover {
    background-color: #ccc;
  }
`;

const BoxContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
`;

const ReceiptDialogStyled = styled.section`
  padding: 1rem;

  h1 {
    font-size: 35px;
    margin-bottom: 1rem;
  }

  section {
    display: flex;
    gap: 0.5rem;

    article {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      width: 200px;
      height: 150px;
      transition: all 0.5s ease-in-out;
      cursor: pointer;

      &:hover {
      }
    }
  }
`;

const ReceiptDialog = ({ total, lines, shop }) => {
  const dialog = useDialog();
  const [row, setRow] = useState({
    lines,
  });

  return (
    <ReceiptDialogStyled>
      <InvoiceForm
        row={row}
        shop={shop}
        onInvoiceGenerated={() => dialog.close(true)}
      />
    </ReceiptDialogStyled>
  );
};

const AddPurchaseDialog = ({ item }) => {
  const [amount, setAmount] = useState(item ? item.sell_price.toFixed(2) : "");
  const [title, setTitle] = useState("");
  const dialog = useDialog();

  const addPurchase = (e) => {
    e.preventDefault();

    if (item.isCustom) {
      dialog.close({
        ...item,
        amount,
        title,
      });
    } else {
      dialog.close({
        ...item,
        amount,
      });
    }
  };

  return (
    <Modal>
      <h2>Add {!item.isCustom ? item.title : "Custom"}</h2>

      <form onSubmit={addPurchase} className="flex flex-col gap-4 items-start">
        {item.isCustom && (
          <FloatingTextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            width="100%"
          />
        )}

        <FloatingTextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          width="100%"
        />

        <PrimaryButton>Add</PrimaryButton>
      </form>
    </Modal>
  );
};

function Purchases(props) {
  const { shop } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (search) {
      let timeoutId = setTimeout(async () => {
        await getProducts(1, search);
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      getProducts(1);
    }
  }, [search]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (page = 1, searchQuery = "") => {
    const productsResponse = await HttpClient().get(
      "/api/products?page=" + page + "&search=" + searchQuery
    );

    const servicesResponse = await HttpClient().get(
      "/api/services?page=" + page + "&search=" + searchQuery
    );
    setFilteredItems([
      ...items.filter((x) => x.title.toLowerCase().includes(searchQuery)),
      ...productsResponse.data.content,
      ...servicesResponse.data.content,
    ]);
  };

  const addPurchase = async (item) => {
    const result = await CustomDialog(<AddPurchaseDialog item={item} />);
    if (result) {
      const _purchases = [...purchases];
      _purchases.push(result);
      setPurchases(_purchases);
    }
  };

  const deletePurchase = async (index) => {
    const _purchases = [...purchases].filter((x, i) => i !== index);
    setPurchases(_purchases);
  };

  const getTotal = () => {
    if (!purchases.length) return 0;

    let total = 0;

    purchases.forEach((x) => {
      total += parseFloat(x.amount);
    });

    return total;
  };

  const registerPurchase = async () => {
    const result = await CustomDialog(
      <ReceiptDialog total={getTotal()} lines={purchases} shop={shop} />,
      {
        className: "big-dialog",
      }
    );

    if (result) {
      cogoToast.success("Successfully registered payment");
      setPurchases([]);
    }
  };

  return (
    <Page>
      <Wrapper>
        <div style={{ flex: 1, height: "100%", overflowY: "auto" }}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search here..."
          />
          <div>
            <BoxContainer>
              {filteredItems.map((item, index) => (
                <Box key={index} onClick={() => addPurchase(item)}>
                  {item.title}
                </Box>
              ))}
            </BoxContainer>
          </div>
        </div>
        <TotalContainer>
          <h2>Purchases</h2>

          <ul>
            {purchases.map((purchase, index) => (
              <li key={index}>
                <span>
                  {purchase.title} - {parseFloat(purchase.amount).toFixed(2)}
                </span>
                <a href="#" onClick={() => deletePurchase(index)}>
                  Delete
                </a>
              </li>
            ))}
          </ul>

          <article>
            <span>TOTAL: {getTotal().toFixed(2)}</span>
            <PrimaryButton
              onClick={registerPurchase}
              disabled={getTotal() === 0}
            >
              Register
            </PrimaryButton>
          </article>
        </TotalContainer>
      </Wrapper>
    </Page>
  );
}

export default Purchases;
