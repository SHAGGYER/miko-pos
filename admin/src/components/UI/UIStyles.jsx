import styled from "styled-components";

// Alert

export const AlertStyle = styled.div`
  background-color: ${(props) =>
    props.success
      ? props.theme.green
      : props.primary
      ? props.theme.blue
      : props.error
      ? "var(--red)"
      : "black"};
  padding: 0.5rem 1rem;
  position: relative;
  margin-bottom: 1rem;
  border-radius: 10px;
  color: white;
  width: 100%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
`;

// Grid

export const GridStyle = styled.div`
  display: grid;
  gap: ${(props) => (props.gap ? props.gap + "rem" : 0)};
  grid-template-columns: ${(props) => props.columns};
`;

// List

export const ListWrapper = styled.ul`
  list-style: none;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.25);
  color: black;
  width: 100%;
`;

export const ListItemWrapper = styled.li`
  padding: 0.5rem;
  background-color: ${(props) =>
    props.dark ? props.theme.lightBlueGray : "white"};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom + "rem" : "0"};
  color: ${(props) => (props.dark ? "white" : "black")};
`;

// Text

export const TextStyle = styled.p`
  color: ${(props) => props.color || "black"};
  text-align: ${(props) =>
    props.center ? "center" : props.right ? "right" : "left"};
  font-size: ${(props) => props.size || "16"}px;
`;

// Spacer

export const SpacerStyle = styled.span`
  display: block;
  margin-bottom: ${(props) => (props.bottom ? props.bottom + "rem" : 0)};
  margin-right: ${(props) => (props.right ? props.right + "rem" : 0)};
  margin-left: ${(props) => (props.left ? props.left + "rem" : 0)};
  margin-top: ${(props) => (props.top ? props.top + "rem" : 0)};
`;

// FlexBox

export const FlexboxStyle = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : "row")};
  align-items: ${(props) => (props.align ? props.align : "flex-start")};
  justify-content: ${(props) => (props.justify ? props.justify : "flex-start")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  flex-wrap: ${(props) => (props.wrap ? "wrap" : "nowrap")};
  width: 100%;
  gap: ${(props) => (props.gap ? props.gap : 0)};
`;

// Button

export const ButtonStyle = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.success
      ? "var(--green)"
      : props.primary
      ? "var(--primary)"
      : props.error
      ? "var(--red)"
      : "white"};
  border-radius: 10px;
  color: black;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  & i {
    margin-right: 0.5rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Card

export const CardStyle = styled.div`
  background-color: ${(props) => (props.color ? props.color : "white")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  border-radius: 10px;
  position: relative;
  color: ${(props) => (props.color ? props.color : "white")};
  width: ${(props) => (props.width ? props.width : "100%")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
`;
