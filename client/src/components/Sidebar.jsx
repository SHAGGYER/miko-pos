import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "./PrimaryButton";
import { AppContext } from "../AppContext";

const SidebarStyled = styled.nav`
  min-width: 300px;
  max-width: 300px;
  padding: 1rem;
  height: 100%;
  background-color: #0c5460;
  color: white;
  display: flex;
  flex-direction: column;

  .title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 2rem;
  }

  article {
    flex: 1;

    ul {
      list-style-type: none;

      li {
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.5s ease-in-out;

        &:hover {
          padding-left: 1rem;
        }
      }
    }
  }
`;

function Sidebar(props) {
  const { user, logout, shop } = useContext(AppContext);
  const navigate = useNavigate();

  const items = [
    {
      title: "Purchases",
      to: "/",
    },
    {
      title: "Bank Accounts",
      to: "/accounts",
    },
    {
      title: "Settings",
      to: "/settings",
    },
  ];

  return (
    <SidebarStyled>
      <div className="title">
        <h3>{shop?.title}</h3>
        <h5>{user.name}</h5>
      </div>
      <article>
        {shop ? (
          <ul>
            <li onClick={() => navigate("/")}>Dashboard</li>
            <li onClick={() => navigate("/purchases")}>Purchases</li>
            <li onClick={() => navigate("/accounts")}>Accounts</li>
            <li onClick={() => navigate("/products")}>Products</li>
            <li onClick={() => navigate("/services")}>Services</li>
            <li onClick={() => navigate("/history")}>History</li>
          </ul>
        ) : (
          <ul>
            <li onClick={() => navigate("/shops/create")}>Create Shop</li>
          </ul>
        )}
      </article>
      <PrimaryButton onClick={logout}>Logout</PrimaryButton>
    </SidebarStyled>
  );
}

export default Sidebar;
