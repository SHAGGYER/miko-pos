import React, { useState } from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "./UI/Form";
import PrimaryButton from "./UI/PrimaryButton";
import { UI } from "./UI/UI";
import { useDialog } from "react-st-modal";
import cogoToast from "cogo-toast";
import domainValidator from "domain-regex";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

export default function CreateUserDialog({ user }) {
  const dialog = useDialog();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      domain: name,
      userId: user.id,
    };

    try {
      await HttpClient().post("/api/user/prepare-create-webhotel", body);
      cogoToast.success("Webhotel oprettet");
      dialog.close(true);
    } catch (error) {
      if (error.response) {
        cogoToast.error(error.response.data.error);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Opret Webhotel</h2>

      <form onSubmit={onSubmit}>
        <Form.TextField
          label="Domæne"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <UI.Spacer bottom={1} />

        <PrimaryButton type="submit">Opret</PrimaryButton>
      </form>
    </Wrapper>
  );
}
