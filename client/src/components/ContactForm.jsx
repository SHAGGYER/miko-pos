import React, { useState } from "react";
import FloatingTextField, { ErrorStyle } from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";
import FloatingTextArea from "./FloatingTextArea";
import { LabelStyle } from "./Select";
import { CountryDropdown } from "react-country-region-selector";
import SettingsGroup from "./SettingsGroup";
import styled from "styled-components";
import cogoToast from "cogo-toast";

const CountrySelect = styled.div`
  select {
    border: 1px solid #ccc;
    padding: 1rem;
    width: 100%;
  }
`;

function ContactForm({ row, onCreated, onUpdated }) {
  const [name, setName] = useState(row ? row.name : "");
  const [email, setEmail] = useState(row ? row.email : "");
  const [note, setNote] = useState(row ? row.note : "");
  const [showNote, setShowNote] = useState(row ? !!row.note : false);
  const [error, setError] = useState({});
  const [address, setAddress] = useState(
    row && row.address
      ? row.address
      : {
          street: "",
          zip: "",
          city: "",
          country: "",
        }
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    try {
      const body = {
        name,
        email,
        note,
        address,
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/contacts", body);
        onCreated(data.content);
        cogoToast.success("Contact created successfully");
      } else {
        await HttpClient().put(`/api/contacts/${row._id}`, body);
        onUpdated({ ...row, ...body });
        cogoToast.success("Contact updated successfully");
      }
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
    <div className="p-4">
      <h2>{row ? "Update" : "Create"} Contact</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-start gap-4">
        <FloatingTextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error.name}
          width="100%"
        />
        <FloatingTextField
          label="Email"
          value={email}
          error={error.email}
          onChange={(e) => setEmail(e.target.value)}
          width="100%"
        />

        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4 w-full">
            <FloatingTextField
              label="Address"
              width="100%"
              value={address?.street}
              error={error.address?.street}
              onChange={(e) => handleChangeAddress("street", e.target.value)}
            />
            <FloatingTextField
              label="Zip"
              width="100%"
              error={error.address?.zip}
              value={address?.zip}
              onChange={(e) => handleChangeAddress("zip", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <FloatingTextField
              label="City"
              error={error.address?.city}
              value={address?.city}
              width="100%"
              onChange={(e) => handleChangeAddress("city", e.target.value)}
            />
            <CountrySelect>
              <LabelStyle>Country</LabelStyle>
              <CountryDropdown
                value={address?.country}
                onChange={(val) => handleChangeAddress("country", val)}
              />
              {error.address?.country && (
                <ErrorStyle>{error.address?.country}</ErrorStyle>
              )}
            </CountrySelect>
          </div>
        </div>

        {(showNote || !!note) && (
          <FloatingTextArea
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}

        <div className="flex gap-1">
          <PrimaryButton>Save</PrimaryButton>
          {(showNote || note) && (
            <PrimaryButton
              type="button"
              onClick={() => {
                setShowNote(false);
                setNote("");
              }}
            >
              Close Note
            </PrimaryButton>
          )}
          {!showNote && !note && (
            <PrimaryButton onClick={() => setShowNote(true)} type="button">
              Note
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
