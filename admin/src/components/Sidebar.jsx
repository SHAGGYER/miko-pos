import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

const SidebarWrapper = styled.div`
  width: 300px;
  height: 100%;
  background-color: var(--primary-dark);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  color: white;

  .header {
    display: flex;
    text-align: center;
    flex-direction: column;
    padding: 1rem;

    h1 {
      margin-bottom: 0.5rem;
      line-height: 1;
      font-family: "Anton", sans-serif;
      letter-spacing: 2px;
    }
  }

  .content {
    flex: 1;
    padding: 1rem;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.5rem;
        margin: 0 0 0.5rem;
        border-radius: 0.5rem;
        background-color: var(--primary);
        font-size: 1.2rem;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: var(--primary-light);
          color: black;
        }
      }
    }
  }
`;

function Sidebar(props) {
  const { admin, logout } = useContext(AppContext);

  const navigate = useNavigate();

  const userItems = [
    {
      title: "Browse",
      to: "/users",
    },
    {
      title: "Create",
      to: "/users/create",
    },
  ];

  return (
    <SidebarWrapper>
      <div className="header">
        <h1>Miko POS ACP</h1>
        <p>{admin.name}</p>
      </div>

      <div className="content">
        <ul>
          <li onClick={() => navigate("/")}>Dashboard</li>
          <SidebarMenu title="Users" items={userItems} />
          <li onClick={() => navigate("/page-builder")}>Page Builder</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
        </ul>
      </div>

      <LogoutButton onClick={logout}>Logout</LogoutButton>
    </SidebarWrapper>
  );
}

export default Sidebar;
