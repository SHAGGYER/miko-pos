import { Arrow } from "./Arrow";
import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useClickOutside } from "../hooks/ClickOutside";

const SlideIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
`;

const SlideOut = keyframes`
  from {
    pointer-events: none;
    opacity: 1;
    visibility: visible;
  }

  to {
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.1);
  }
`;
const PopoverElement = styled.div`
  z-index: 10;
  position: absolute;
  background: var(--primary-light);

  ${(props) =>
    props.initial
      ? css`
          visibility: hidden;
          opacity: 0;
        `
      : props.isOpen === true
      ? css`
          animation: ${SlideIn} forwards 0.3s ease-in-out;
        `
      : props.isOpen === false
      ? css`
          animation: ${SlideOut} forwards 0.3s ease-in-out;
        `
      : ""}
`;

const Popover = React.memo(({ trigger, absolute, position, content }) => {
  const [initial, setInitial] = useState(true);
  const [parentRect, setParentRect] = useState(undefined);
  const [childRect, setChildRect] = useState(undefined);
  const [isOpen, setOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const parentRef = useRef();
  const triggerRef = useRef();

  const onClick = () => {
    if (hasClicked && !isOpen) {
      return;
    }

    setOpen(!isOpen);
  };

  const closeOnClickOutside = () => {
    if (isOpen) {
      setHasClicked(true);
      setOpen(false);
    }
  };

  useClickOutside(parentRef, () => closeOnClickOutside());

  useEffect(() => {
    if (triggerRef.current && parentRef.current) {
      setParentRect(parentRef.current.getBoundingClientRect());
      setChildRect(triggerRef.current.getBoundingClientRect());
    }
  }, [triggerRef.current, parentRef.current]);

  useEffect(() => {
    if (isOpen) {
      setInitial(false);
    } else {
      setTimeout(() => {
        setHasClicked(false);
      }, 100);
    }
  }, [isOpen, hasClicked]);

  return (
    <React.Fragment>
      <div style={{ position: "relative" }}>
        {trigger({ triggerRef, onClick })}
        <PopoverElement
          initial={initial}
          ref={parentRef}
          isOpen={isOpen}
          style={{
            left:
              position === "bottom"
                ? parentRect &&
                  -(parentRect.width / 2) + childRect.width / 2 + "px"
                : position === "right" &&
                  childRect &&
                  childRect.width + 10 + "px",
            top:
              position === "right"
                ? childRect &&
                  childRect.height / 2 - parentRect.height / 2 + "px"
                : position === "bottom"
                ? childRect && childRect.height + 10 + "px"
                : position === "top" &&
                  -(parentRect && parentRect.height) - 15 + "px",
          }}
        >
          <Arrow
            color="var(--primary-light)"
            style={{ zIndex: -1 }}
            position={position}
            top={
              position === "right"
                ? parentRect && parentRect.height / 2 - 15 + "px"
                : position === "bottom"
                ? "0px"
                : position === "top" &&
                  (parentRect && parentRect.height - 23) + "px"
            }
            left={
              position === "bottom"
                ? parentRect && parentRect.width / 2 - 15 + "px"
                : position === "right"
                ? "-5px"
                : position === "top" &&
                  (parentRect && parentRect.width / 2 - 15) + "px"
            }
          />

          {content({ setOpen })}
        </PopoverElement>
      </div>
    </React.Fragment>
  );
});

export default Popover;
