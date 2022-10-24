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
import Select from "../components/Select";
import moment from "moment";

export const getTotal = (lines) => {
  if (!lines.length) return 0;

  let total = 0;

  lines.forEach((x) => {
    if (x.isDiscount && x.computationStyle === "static") {
      total -= parseFloat(x.sell_price);
    } else if (!x.isDiscount) {
      total += x.quantity * parseFloat(x.sell_price);
    }
  });

  lines.forEach((x) => {
    if (
      x.isDiscount &&
      x.computationStyle === "percentage" &&
      x.sell_price > 0
    ) {
      total = total - (x.sell_price / 100) * total;
    }
  });

  return total;
};

const items = [
  {
    _id: 1,
    product: {
      title: "Custom",
    },
    isCustom: true,
  },
  {
    _id: 2,
    product: {
      title: "Discount",
    },
    isDiscount: true,
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

const ReceiptDialog = ({ total, lines, shop, contact, dbCase }) => {
  const dialog = useDialog();
  const [row, setRow] = useState({
    lines,
    contact,
  });

  const handleClose = async () => {
    if (dbCase) {
      await HttpClient().put(`/api/cases/${dbCase._id}`, {
        paidAt: moment().format("YYYY-MM-DD"),
      });
    }

    dialog.close(true);
  };

  return (
    <ReceiptDialogStyled>
      <InvoiceForm
        total={total}
        row={row}
        shop={shop}
        onInvoiceGenerated={() => handleClose()}
      />
    </ReceiptDialogStyled>
  );
};

const AddPurchaseDialog = ({ item }) => {
  const [title, setTitle] = useState("");
  const [sell_price, setSellPrice] = useState(
    item ? item.sell_price?.toFixed(2) : ""
  );
  const [computationStyle, setComputationStyle] = useState("static");
  const dialog = useDialog();

  const addPurchase = (e) => {
    e.preventDefault();

    if (item.isCustom) {
      dialog.close({
        ...item,
        sell_price: parseFloat(sell_price),
        quantity: 1,
        product: {
          title,
        },
      });
    } else {
      dialog.close({
        ...item,
        product: {
          title: item.product.title,
        },
        quantity: 1,
        sell_price: parseFloat(sell_price),
        computationStyle: item.isDiscount ? computationStyle : undefined,
      });
    }
  };

  return (
    <Modal>
      <h2>
        Add{" "}
        {item.isCustom ? "Custom" : item.isDiscount ? "Discount" : item.title}
      </h2>

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
          value={sell_price}
          onChange={(e) => setSellPrice(e.target.value)}
          label="Amount"
          width="100%"
        />

        {item.isDiscount && (
          <Select
            label="Computation Style"
            value={computationStyle}
            onChange={(e) => setComputationStyle(e.target.value)}
          >
            <option value="static">Static</option>
            <option value="percentage">Percentage</option>
          </Select>
        )}

        <PrimaryButton>Add</PrimaryButton>
      </form>
    </Modal>
  );
};

function Purchases(props) {
  const { shop, purchase, setPurchase } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [lines, setLines] = useState(
    purchase?.lines?.length ? purchase.lines : []
  );
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

    setFilteredItems([
      ...items.filter((x) =>
        x.product?.title.toLowerCase().includes(searchQuery)
      ),
      ...productsResponse.data.content.map((x) => {
        return {
          product: x,
          sell_price: x.sell_price,
          quantity: 1,
          _id: x._id,
        };
      }),
    ]);
  };

  const addPurchase = async (item) => {
    if (item.isCustom || item.isDiscount) {
      const result = await CustomDialog(<AddPurchaseDialog item={item} />);
      if (result) {
        const _lines = [...lines];
        _lines.push(result);
        setLines(_lines);
      }
    } else {
      const _lines = [...lines];
      let found = _lines.find((x) => x._id === item._id);

      if (!found) {
        _lines.push(item);
      } else {
        found.quantity++;
      }

      setLines(_lines);
    }
  };

  const deletePurchase = async (index) => {
    const _lines = [...lines].filter((x, i) => i !== index);
    setLines(_lines);
  };

  const registerPurchase = async () => {
    const result = await CustomDialog(
      <ReceiptDialog
        contact={purchase?.contact}
        total={getTotal(lines)}
        lines={lines}
        dbCase={purchase?.dbCase}
        shop={shop}
      />,
      {
        className: "big-dialog",
      }
    );

    if (result) {
      cogoToast.success("Successfully registered payment");
      setLines([]);
      setPurchase(null);
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
                  {item.product?.title}
                </Box>
              ))}
            </BoxContainer>
          </div>
        </div>
        <TotalContainer>
          <h2>Purchases</h2>

          <ul>
            {lines.map((purchase, index) => (
              <li key={index}>
                <span>
                  {purchase.product?.title} -{" "}
                  {purchase.isDiscount &&
                  purchase.computationStyle === "percentage" ? (
                    <span>{purchase.sell_price}%</span>
                  ) : (
                    <span>{parseFloat(purchase.sell_price).toFixed(2)}</span>
                  )}
                  <span> x {purchase.quantity}</span>
                </span>
                <a href="#" onClick={() => deletePurchase(index)}>
                  Delete
                </a>
              </li>
            ))}
          </ul>

          <article>
            <span>TOTAL: {getTotal(lines).toFixed(2)}</span>
            <PrimaryButton
              onClick={registerPurchase}
              disabled={getTotal(lines) === 0}
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
