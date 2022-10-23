import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Stepper, Step } from "react-form-stepper";
import PrimaryButton from "./UI/PrimaryButton";
import HttpClient from "../services/HttpClient";
import Page from "./Page";
import Alert from "./UI/Alert";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import Switch from "react-switch";
import AppContext from "../AppContext";

const SwitchContainer = styled.label`
  display: grid;
  grid-template-columns: 50px 1fr;
  align-items: center;
  gap: 1rem;
`;

const Wrapper = styled.div`
  background-color: var(--primary);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
    text-align: center;
  }
`;

export default function InstallationWizard() {
  const { appSettings } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(appSettings?.appName ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [appName, setAppName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const saveAppName = async () => {
    try {
      setLoading(true);
      await HttpClient().post("/api/admin/installation/app-name", { appName });
      setCurrentStep(currentStep + 1);
      setLoading(false);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
        setLoading(false);
      }
    }
  };

  const createAdminAccount = async () => {
    try {
      setLoading(true);
      await HttpClient().post("/api/admin/installation/admin-account", {
        name,
        email,
        password,
        passwordAgain,
      });
      setCurrentStep(currentStep + 1);
      setLoading(false);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
        setLoading(false);
      }
    }
  };

  return (
    <Page>
      <Wrapper>
        <h2>Installation</h2>

        <Stepper activeStep={currentStep}>
          <Step label="Appnavn" />
          <Step label="Admin Konto" />
          <Step label="Færdig" />
        </Stepper>

        {currentStep === 0 && (
          <div>
            <Form.TextField
              label="Appnavn"
              value={appName}
              error={error.appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <UI.Spacer bottom={1} />
            <PrimaryButton onClick={saveAppName} $loading={loading}>
              {loading && <i className="fas fa-spinner fa-spin" />}
              Fortsæt
            </PrimaryButton>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <Form.TextField
              label="Navn"
              value={name}
              error={error.name}
              onChange={(e) => setName(e.target.value)}
            />
            <UI.Spacer bottom={1} />

            <Form.TextField
              label="Email"
              value={email}
              error={error.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <UI.Spacer bottom={1} />

            <Form.TextField
              label="Password"
              value={password}
              error={error.password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <UI.Spacer bottom={1} />

            <Form.TextField
              label="Password Confirmation"
              value={passwordAgain}
              error={error.passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
            />
            <UI.Spacer bottom={1} />

            <PrimaryButton onClick={createAdminAccount}>Næste</PrimaryButton>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <p style={{ marginBottom: "1rem" }}>
              Du er nu færdig. Klik på følgende knap for at fortsætte.
            </p>
            <PrimaryButton onClick={() => window.location.reload()}>
              Fortsæt
            </PrimaryButton>
          </div>
        )}
      </Wrapper>
    </Page>
  );
}
