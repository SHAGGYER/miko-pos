import React, { useEffect, useState } from "react";
import "./App.css";
import { HttpClient } from "./utilities/HttpClient";
import FloatingTextField from "./components/FloatingTextField";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import { AppContext } from "./AppContext";
import { Routes, Route } from "react-router-dom";
import Purchases from "./pages/Purchases";
import Accounts from "./pages/Accounts";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Pricing from "./pages/Pricing";
import CreateShop from "./pages/CreateShop";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Invoices from "./pages/Invoices";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const WrapperApp = styled.div`
  display: flex;
  height: 100%;
`;

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [initiated, setInitiated] = useState(false);
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/shops/create" && !shop && loaded && user) {
      navigate("/shops/create");
    } else if (
      shop &&
      location.pathname === "/shops/create" &&
      loaded &&
      user
    ) {
      navigate("/");
    }
  }, [shop, location.pathname, loaded, user]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (initiated) return;
    const { data } = await HttpClient().get("/api/auth/init");

    if (data.user) {
      setUser(data.user);
      setShop(data.shop);
    }

    setInitiated(true);
    setLoaded(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {initiated && (
        <AppContext.Provider
          value={{
            user,
            setUser,
            logout,
            shop,
            setShop,
          }}
        >
          {user ? (
            <WrapperApp>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/history" element={<History />} />
                <Route path="/shops/create" element={<CreateShop />} />
                <Route path="/products" element={<Products />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
              </Routes>
            </WrapperApp>
          ) : (
            <>
              <Navbar />
              <Wrapper>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/pricing" element={<Pricing />} />
                </Routes>
                <Footer />
              </Wrapper>
            </>
          )}
        </AppContext.Provider>
      )}
    </>
  );
}

export default App;
