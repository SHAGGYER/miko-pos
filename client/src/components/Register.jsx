import React, { useState } from "react";
import styled from "styled-components";
import FloatingTextField, { ErrorStyle } from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  border: 1px solid #ebebeb;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;

const MESSAGES = {
  INVALID_CREDENTIALS: "You have entered invalid credentials",
};

function Register({ setMode }) {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertError, setAlertError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();

    setError({});
    const _error = {};

    if (!name) _error.name = "Name is required";
    if (!email) _error.email = "Email is required";
    if (!password) _error.password = "Password is required";

    if (Object.keys(_error).length) {
      setError(_error);
      return;
    }

    try {
      setLoading(true);

      const body = {
        name,
        email,
        password,
      };

      const { data } = await HttpClient().post("/api/auth/register", body);
      localStorage.setItem("token", data.token);
      setLoading(false);
      window.location.reload();
    } catch (e) {
      if (e.response && e.response.status === 401) {
        setAlertError(MESSAGES[e.response.data.message]);
      }

      setLoading(false);
    }
  };

  return (
    <div>
      <Wrapper>
        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          {!!alertError && <ErrorStyle>{alertError}</ErrorStyle>}
          <FloatingTextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
            error={error.name}
          />
          <FloatingTextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            error={error.email}
          />
          <FloatingTextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            error={error.password}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <PrimaryButton $loading={loading}>Register</PrimaryButton>
            <PrimaryButton onClick={() => setMode("login")}>
              Go Back To Login
            </PrimaryButton>
          </div>
        </form>
      </Wrapper>
    </div>
  );
}

export default Register;
