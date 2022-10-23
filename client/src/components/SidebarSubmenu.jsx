import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useClickOutside } from "../hooks/ClickOutside";

const SubmenuStyled = styled.li`
  position: relative;
  z-index: 99;

  > section {
    position: absolute;
    top: 50px;
    right: 0;
    min-width: 250px;
    background: white;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.25);
    border-radius: 7px;
    cursor: default;
  }
`;

function SidebarSubmenu({ title, component }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  useClickOutside(wrapperRef, () => setOpen(false));

  return (
    <SubmenuStyled onClick={() => setOpen(true)}>
      <article>{title}</article>
      {open && <section ref={wrapperRef}>{component}</section>}
    </SubmenuStyled>
  );
}

export default SidebarSubmenu;
