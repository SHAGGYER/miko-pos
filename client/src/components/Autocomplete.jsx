import React, { useEffect, useRef, useState } from "react";
import { useKeyPress } from "../hooks/KeyPress";
import FloatingTextField from "./FloatingTextField";
import styled from "styled-components";
import { HttpClient } from "../utilities/HttpClient";
import { useClickOutside } from "../hooks/ClickOutside";

const MenuStyled = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  min-width: 400px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;

  .results {
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
  }
`;

const ResultStyled = styled.article`
  background: ${(props) => (props.$active ? "var(--blue)" : "transparent")};
  padding: 1rem;
  cursor: pointer;
  width: 100%;
`;

const Result = ({ item, active, onSelect, setHovered, prop }) => (
  <ResultStyled
    $active={active}
    onClick={() => onSelect(item)}
    onMouseEnter={() => setHovered(item)}
    onMouseLeave={() => setHovered(undefined)}
  >
    {item[prop]}
  </ResultStyled>
);

function Autocomplete({ url, label, onSelect, prop, additionalComponent }) {
  const [search, setSearch] = useState("");
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef();
  useClickOutside(wrapperRef, () => setOpen(false));

  useEffect(() => {
    if (search) {
      let timeoutId = setTimeout(() => {
        fetchRows(search);
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [search]);

  const fetchRows = async (search) => {
    const { data } = await HttpClient().get(`${url}?search=${search}`);
    setItems(data.content);
    setOpen(true);
  };

  useEffect(() => {
    if (items.length && downPress) {
      setCursor((prevState) =>
        prevState < items.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (items.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  useEffect(() => {
    if (items.length && enterPress) {
      handleOnSelect(items[cursor]);
    }
  }, [cursor, enterPress]);

  useEffect(() => {
    if (items.length && hovered) {
      setCursor(items.indexOf(hovered));
    }
  }, [hovered]);

  const handleOnSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <div className="relative" style={{ zIndex: 222 }}>
      <FloatingTextField
        label={label}
        autoFocus={false}
        onClick={() => setOpen(true)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {open && (
        <MenuStyled ref={wrapperRef}>
          <div className="results">
            {items.map((item, i) => (
              <Result
                key={item.id}
                active={i === cursor}
                item={item}
                onSelect={handleOnSelect}
                setHovered={setHovered}
                prop={prop}
              />
            ))}
          </div>
          {additionalComponent}
        </MenuStyled>
      )}
    </div>
  );
}

export default Autocomplete;
