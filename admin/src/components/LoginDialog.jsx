import React, { useState } from "react";
import { useDialog } from "react-st-modal";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import { Form } from "./UI/Form";
import { UI } from "./UI/UI";
import cogoToast from "cogo-toast";

const Wrapper = styled.div`
  background-color: var(--primary-light);
  padding: 1rem;

  h2 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 40px;
  }
`;

export default function LoginDialog({ setUser }) {
  const dialog = useDialog();
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

      const { data } = await HttpClient().post("/api/auth/login", body);
      localStorage.setItem("token", data.token);
      dialog.close();
      cogoToast.success("Du har nu logget ind");
      setTimeout(() => {
        window.location.href = "/journal";
      }, 1000);
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  return (
    <Wrapper>
      <h2>Login</h2>
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
        <UI.Button success onClick={login}>
          Login
        </UI.Button>
      </form>
    </Wrapper>
  );
}
