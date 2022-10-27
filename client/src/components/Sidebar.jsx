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
  background: #363740;
  display: flex;
  flex-direction: column;

  .title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 2rem;
    color: #a4a6b3;
  }

  article {
    flex: 1;

    ul {
      list-style-type: none;

      li {
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.5s ease-in-out;
        color: #a4a6b3;

        margin-bottom: 0.5rem;
        border-radius: 7px;

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
            <li onClick={() => navigate("/purchases")}>Cash Register</li>
            <li onClick={() => navigate("/cases")}>Case Management</li>
            <li onClick={() => navigate("/contacts")}>Contacts</li>
            <li onClick={() => navigate("/products")}>Products</li>
            <li onClick={() => navigate("/invoices")}>Invoices</li>
            <li onClick={() => navigate("/storage")}>Storage</li>
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
