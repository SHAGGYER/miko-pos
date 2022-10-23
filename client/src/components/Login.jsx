import React, { useState } from "react";
import styled from "styled-components";
import FloatingTextField, { ErrorStyle } from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";
import Register from "./Register";

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

function Login(props) {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertError, setAlertError] = useState(null);
  const [mode, setMode] = useState("login");

  const onSubmit = async (event) => {
    event.preventDefault();

    setError({});
    const _error = {};

    if (!email) _error.email = "Email is required";
    if (!password) _error.password = "Password is required";

    if (Object.keys(_error).length) {
      setError(_error);
      return;
    }

    try {
      setLoading(true);

      const body = {
        email,
        password,
      };

      const { data } = await HttpClient().post("/api/auth/login", body);
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
      {mode === "login" ? (
        <Wrapper>
          <h1>Login</h1>
          <form onSubmit={onSubmit}>
            {!!alertError && <ErrorStyle>{alertError}</ErrorStyle>}
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
              <PrimaryButton $loading={loading}>Login</PrimaryButton>
              <PrimaryButton onClick={() => setMode("register")}>
                Create Account
              </PrimaryButton>
            </div>
          </form>
        </Wrapper>
      ) : (
        <Register setMode={setMode} />
      )}
    </div>
  );
}

export default Login;
