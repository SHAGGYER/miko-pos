import React, { useContext } from "react";
import styled from "styled-components";
import { createPopup } from "encryptly-client";
import { HttpClient } from "../utilities/HttpClient";
import SidebarSubmenu from "./SidebarSubmenu";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

const NavbarStyled = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  ul {
    list-style: none;
    display: flex;

    li {
      padding: 1rem;
      cursor: pointer;
      transition: all 0.5s ease-in-out;

      &:hover {
        background: rgba(186, 189, 193, 0.25);
      }
    }
  }
`;

function Navbar(props) {
  const navigate = useNavigate();

  const openEncryptlyPopup = () => {
    const options = {
      serverUrl: "https://encryptly.mikolaj.dk",
      clientId: import.meta.env.VITE_ENCRYPTLY_CLIENT_ID,
      type: "login",
    };
    createPopup(options, (token) => handleEncryptlyResponse(token));
  };

  const openEncryptlyPopupRegister = () => {
    const options = {
      serverUrl: "https://encryptly.mikolaj.dk",
      clientId: import.meta.env.VITE_ENCRYPTLY_CLIENT_ID,
      type: "register",
    };
    createPopup(options, (token) => handleEncryptlyResponse(token));
  };

  const handleEncryptlyResponse = async (token) => {
    const { data } = await HttpClient().get("/api/auth/oauth?token=" + token);
    localStorage.setItem("token", data.token);
    window.location.reload();
  };

  return (
    <NavbarStyled>
      <a
        rel="noopener noreferrer"
        href="#"
        className="flex justify-center space-x-3 lg:justify-start"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="flex-shrink-0 w-5 h-5 rounded-full text-gray-900"
          >
            <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
          </svg>
        </div>
        <span className="self-center text-2xl font-semibold">
          {import.meta.env.VITE_APP_NAME}
        </span>
      </a>
      <ul>
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/pricing")}>Pricing</li>
        <SidebarSubmenu
          title="Help"
          component={<article className="p-8">To be implemented...</article>}
        />
        <li onClick={openEncryptlyPopup}>Login</li>
        <li onClick={openEncryptlyPopupRegister}>Create an Account</li>
      </ul>
    </NavbarStyled>
  );
}

export default Navbar;
