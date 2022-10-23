import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import FloatingTextField, { ErrorStyle } from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { AppContext } from "../AppContext";
import SettingsGroup from "../components/SettingsGroup";
import { CountryDropdown } from "react-country-region-selector";
import { LabelStyle } from "../components/Select";

const CountrySelect = styled.div`
  select {
    border: 1px solid #ccc;
    padding: 1rem;
    width: 100%;
  }
`;

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
  const [startSku, setStartSku] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    zip: "",
    city: "",
    country: "",
  });
  const [error, setError] = useState({});

  useEffect(() => {}, []);

  const createShop = async () => {
    const body = {
      title,
      startSku: parseInt(startSku),
      address,
    };

    try {
      const { data } = await HttpClient().post("/api/user/create-shop", body);
      setShop(data.content.shop);
      setUser(data.content.user);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  const handleChangeAddress = (prop, value) => {
    const _address = { ...address };
    _address[prop] = value;
    setAddress(_address);
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
            <div className="flex flex-col gap-4">
              <FloatingTextField
                label="Shop Title"
                value={title}
                error={error.title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <FloatingTextField
                label="Address"
                value={address.street}
                error={error.address?.street}
                onChange={(e) => handleChangeAddress("street", e.target.value)}
              />
              <FloatingTextField
                label="Zip"
                error={error.address?.zip}
                value={address.zip}
                onChange={(e) => handleChangeAddress("zip", e.target.value)}
              />
              <FloatingTextField
                label="City"
                error={error.address?.city}
                value={address.city}
                onChange={(e) => handleChangeAddress("city", e.target.value)}
              />
              <CountrySelect>
                <LabelStyle>Country</LabelStyle>
                <CountryDropdown
                  value={address.country}
                  onChange={(val) => handleChangeAddress("country", val)}
                />
                {error.address?.country && (
                  <ErrorStyle>{error.address?.country}</ErrorStyle>
                )}
              </CountrySelect>
            </div>
          </SettingsGroup>
          <SettingsGroup
            title="Settings"
            description="Customize your experience"
          >
            <FloatingTextField
              label="Start SKU"
              type="text"
              value={startSku}
              error={error.startSku}
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
