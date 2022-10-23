import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "./UI/PrimaryButton";
import FloatingTextField from "shaggyer-cmps/src/FloatingTextField";
import { CustomDialog, useDialog } from "react-st-modal";
import HttpClient from "../services/HttpClient";

const Container = styled.section`
  padding: 1rem;

  h3 {
    margin-bottom: 1rem;
  }

  .gift-subscription {
    border: 1px solid black;
    padding: 1rem;

    h4 {
      margin-bottom: 0.5rem;
    }
  }
`;

const GiftSubscriptionDialog = ({ userId }) => {
  const dialog = useDialog();
  const [days, setDays] = useState("");

  const onSubmit = async () => {
    const body = {
      userId,
      days,
    };

    await HttpClient().post("/api/billing/give-subscription-days", body);
    dialog.close(true);
  };

  return (
    <Container>
      <h3>Giv abonnement som gave</h3>

      <FloatingTextField
        type="number"
        label="Antal dage..."
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <PrimaryButton onClick={onSubmit}>Gem</PrimaryButton>
    </Container>
  );
};

function EditUserDialog({ userId }) {
  const openGiveSubscriptionDialog = async () => {
    const result = await CustomDialog(
      <GiftSubscriptionDialog userId={userId} />
    );
  };

  return (
    <Container>
      <h3>Redigér Bruger</h3>

      <article className="gift-subscription">
        <h4>Giv abonnement som gave</h4>
        <PrimaryButton onClick={openGiveSubscriptionDialog}>
          Start her...
        </PrimaryButton>
      </article>
    </Container>
  );
}

export default EditUserDialog;
