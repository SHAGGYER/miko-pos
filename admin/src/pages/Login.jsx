import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "../components/UI/Form";
import { UI } from "../components/UI/UI";
import { Alert } from "../components/UI/Alert";
import PrimaryButton from "../components/UI/PrimaryButton";

const Wrapper = styled.div`
  background-color: var(--primary-dark);
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const login = async (event) => {
    event.preventDefault();
    try {
      const body = {
        email,
        password,
      };

      const { data } = await HttpClient().post("/api/auth/admin/login", body);
      localStorage.setItem("token", data.token);
      window.location.reload();
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Login</h2>
      {!!error.error && (
        <Alert error color="white">
          {error.error}
        </Alert>
      )}
      <form onSubmit={login}>
        <Form.TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label={"Email"}
          error={error.email}
        />
        <UI.Spacer bottom={1} />
        <Form.TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label={"Password"}
          error={error.password}
        />
        <UI.Spacer bottom={1} />
        <PrimaryButton>Log Ind</PrimaryButton>
      </form>
    </Wrapper>
  );
}
