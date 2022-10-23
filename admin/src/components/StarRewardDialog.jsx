import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import IconStar from "../images/icon_star.svg";

const StarReward = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: ${(props) => (props.$closing ? MoveDown : ScaleUp)} 0.5s
    ease-in-out forwards;
`;

const StarRewardDialog = ({ onClosed }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setClosing(true);
    }, 2500);
  }, []);

  useEffect(() => {
    if (closing) {
      setTimeout(() => {
        onClosed();
      }, 500);
    }
  }, [closing]);

  return (
    <StarReward $closing={closing}>
      <img
        src={IconStar}
        style={{ color: "var(--primary-light)", fontSize: 100 }}
      />
      <h2>Reward Received</h2>
    </StarReward>
  );
};

export default StarRewardDialog;
