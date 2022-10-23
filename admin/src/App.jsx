import React, { useEffect, useState } from "react";
import "./App.css";
import HttpClient from "./services/HttpClient";
import AppContext from "./AppContext";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "./components/UI/Wrapper";
import Sidebar from "./components/Sidebar";
import { Page } from "./components/UI/Page";
import Login from "./pages/Login";

import queryString from "query-string";
import cogoToast from "cogo-toast";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import PageBuilder from "./pages/PageBuilder";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = queryString.parse(location.search);

  const [admin, setAdmin] = useState(null);
  const [shop, setShop] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [appSettings, setAppSettings] = useState(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cogoToast.success("Du er nu logget ind");
      navigate("/");
    }
  }, [isLoggedIn]);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/admin/init");

    setAppSettings(data.appSettings);

    if (data.admin) {
      setAdmin(data.admin);
    }
    setInitiated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
  };

  return (
    initiated && (
      <AppContext.Provider
        value={{
          admin,
          setAdmin,
          logout,
          appSettings,
          setAppSettings,
        }}
      >
        <>
          <>
            {admin ? (
              <>
                <Wrapper>
                  <Sidebar />
                  <Page>
                    <Routes>
                      <Route path="/users" element={<Users />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/page-builder" element={<PageBuilder />} />
                    </Routes>
                  </Page>
                </Wrapper>
              </>
            ) : (
              <Login />
            )}
          </>
        </>
      </AppContext.Provider>
    )
  );
}

export default App;
