import React, { useRef, useState } from "react";
import PrimaryButton from "./UI/PrimaryButton";
import styled from "styled-components";
import { WIDGETS, Widget } from "../pages/PageBuilder";
import { useClickOutside } from "../hooks/ClickOutside";

const MenuStyled = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  min-width: 250px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  background: white;
  display: flex;
  gap: 0.25rem;
  padding: 1rem;

  article {
    border: 1px solid #ccc;
    padding: 1rem;
    cursor: pointer;
    &:hover {
      background: #ccc;
    }
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 99;

  .preview {
    position: absolute;
    top: 150px;
    width: 700px;
    z-index: 1000;
  }
`;

function WidgetMenu({ onSelected }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(undefined);

  const [currentWidget, setCurrentWidget] = useState(null);

  useClickOutside(wrapperRef, () => setOpen(false));

  return (
    <Container>
      <PrimaryButton onClick={() => setOpen(true)}>Add Widget</PrimaryButton>
      {currentWidget && (
        <div className="preview">
          <Widget type={currentWidget} />
        </div>
      )}
      {open && (
        <MenuStyled ref={wrapperRef}>
          {Object.keys(WIDGETS).map((widget, index) => (
            <article
              onClick={() => {
                onSelected(widget);
                setOpen(false);
                setCurrentWidget(null);
              }}
              key={index}
              onMouseEnter={() => {
                setCurrentWidget(widget);
              }}
              onMouseLeave={() => {
                setCurrentWidget(null);
              }}
            >
              {widget}
            </article>
          ))}
        </MenuStyled>
      )}
    </Container>
  );
}

export default WidgetMenu;
