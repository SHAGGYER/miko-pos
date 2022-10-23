import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

const Container = styled.section`
  position: relative;
  overflow: hidden;
`

const Wrapper = styled.li`
  position: relative;

  .title {

  }

  .item {
    padding: 0.5rem 0.5rem 0.5rem 2rem;
    background-color: var(--primary);
  }
`

const WrapperItems = styled.div`
  padding-left: 2rem;
  user-select: none;
  transition: all 0.3s ease-in-out;
  position: relative;
  height: ${props => props.isOpen ? props.height : 0}px;

  .item {
    padding: 0.5rem;
    margin: ${props => props.isOpen ? "0.5rem 0" : 0};
    border-radius: 0.5rem;
    background-color: var(--primary);
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: var(--primary-light);
      color: black;
    }
  }
`

function SidebarMenu({title, items}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight(items.length * 38 + 8 + 8 + 2)
  }, [])

  return (
    <Container>
      <Wrapper onClick={() => setIsOpen(!isOpen)}>
        <div className="title">{title}</div>

      </Wrapper>
      <WrapperItems height={height} isOpen={isOpen}>
        {items.map((item, index) => (
          <div key={index} className="item" onClick={() => navigate(item.to)}>{item.title}</div>
        ))}
      </WrapperItems>
    </Container>
  );
}

export default SidebarMenu;