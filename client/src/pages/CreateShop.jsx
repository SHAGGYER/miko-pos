import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { AppContext } from "../AppContext";
import SettingsGroup from "../components/SettingsGroup";

const SHOP_TYPES = [
  {
    title: "Personal Budget",
    key: "personal-budget",
  },
  {
    title: "Standard",
    key: "standard",
  },
];

function CreateShop(props) {
  const { setShop, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [startSku, setStartSku] = useState("1000");
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {}, []);

  const createShop = async () => {
    const body = {
      title,
      startSku: parseInt(startSku),
    };

    const { data } = await HttpClient().post("/api/user/create-shop", body);
    setShop(data.content.shop);
    setUser(data.content.user);
  };

  return (
    <Page>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <h1>Create Shop</h1>

          <SettingsGroup
            title="> Shop Data"
            description="Here you can edit shop data"
          >
            <FloatingTextField
              label="Shop Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FloatingTextField
              label="Start SKU"
              type="text"
              value={startSku}
              onChange={(e) => setStartSku(e.target.value)}
            />
          </SettingsGroup>
          <PrimaryButton onClick={createShop}>Create Shop</PrimaryButton>
        </>
      )}
    </Page>
  );
}

export default CreateShop;
