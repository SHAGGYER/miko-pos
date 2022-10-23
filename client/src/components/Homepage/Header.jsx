import React from "react";
import styled from "styled-components";

const HeaderStyled = styled.section`
  padding: 2rem;
  background: var(--primary-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  > span {
    background: white;
    padding: 0.5rem 1rem;
    font-size: 12px;
    border-radius: 10px;
    color: black;
  }

  article {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    h1 {
      color: var(--gray-light);
      font-size: 80px;
      font-weight: bold;

      @media screen and (max-width: 640px) {
        font-size: 35px;
      }
    }

    p {
      color: #bbb;
      text-align: center;
    }

    .buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;

      @media screen and (max-width: 640px) {
        display: block;
        button {
          width: 100%;
          margin-bottom: 1rem;
        }
      }

      button.learn-more {
        display: flex;
        gap: 1rem;
        align-items: center;
        border: 1px solid #1f2937;
        background: #1f2937;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: bold;
        color: var(--gray-light);
      }

      button.watch-video {
        display: flex;
        gap: 1rem;
        align-items: center;

        border: 1px solid rgb(55, 65, 81);
        padding: 1rem 2rem;
        color: white;
        border-radius: 10px;

        &:hover {
          background: rgb(55, 65, 81);
        }
      }
    }
  }
`;

const Badge = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  box-sizing: border-box;
  background: var(--gray-light);
  padding: 0.5rem;
  border-radius: 15px;
  color: black;
  cursor: pointer;
  margin-bottom: 2rem;

  span {
    background: #252629;
    color: var(--gray-light);
    padding: 0.5rem 1rem;
    border-radius: 10px;
  }

  &:hover {
    background: #bbb;
  }
`;

function Header(props) {
  return (
    <HeaderStyled>
      <Badge>
        <span>New</span> {import.meta.env.VITE_APP_NAME} is out!{" "}
        <i className="fa-solid fa-angle-right"></i>
      </Badge>
      <article>
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
          dolorem, fugit laborum libero maiores minima nisi obcaecati quae
          repellendus tempora?
        </p>
        <div className="buttons">
          <button className="learn-more">
            <span>Learn More</span>
            <i className="fa-solid fa-right-long"></i>
          </button>
          <button className="watch-video">
            <i className="fa-solid fa-video"></i>
            <span>Watch Video</span>
          </button>
        </div>
      </article>
    </HeaderStyled>
  );
}

export default Header;
