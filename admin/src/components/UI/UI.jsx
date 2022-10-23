import React from "react";
import {
  AlertStyle,
  ButtonStyle,
  CardStyle,
  FlexboxStyle,
  GridStyle,
  ListItemWrapper,
  ListWrapper,
  SpacerStyle,
  TextStyle,
} from "./UIStyles";
import styled from "styled-components";

// Alert

const Alert = ({success, primary, error, children}) => {
  return (
    <AlertStyle success={success} primary={primary} error={error} role="alert">
      {children}
    </AlertStyle>
  );
};

// Grid

const Grid = ({children, gap, columns}) => {
  return (
    <GridStyle gap={gap} columns={columns}>
      {children}
    </GridStyle>
  );
};

// List

const List = ({children}) => {
  return <ListWrapper>{children}</ListWrapper>;
};

const ListItem = ({children, onClick, dark, marginBottom}) => {
  return (
    <ListItemWrapper onClick={onClick} dark={dark} marginBottom={marginBottom}>
      {children}
    </ListItemWrapper>
  );
};

// Text

const Text = ({children, size, center, right, color, onClick, style}) => {
  return (
    <TextStyle
      size={size}
      center={center}
      right={right}
      color={color}
      onClick={onClick}
      style={style}
    >
      {children}
    </TextStyle>
  );
};

// Spacer

const Spacer = ({bottom, right, left, top}) => {
  return (
    <SpacerStyle
      bottom={bottom}
      right={right}
      left={left}
      top={top}
    ></SpacerStyle>
  );
};

// FlexBox

const FlexBox = ({
                   children,
                   direction,
                   align,
                   justify,
                   padding,
                   wrap,
                   style,
                   onClick,
                   gap
                 }) => {
  return (
    <FlexboxStyle
      onClick={onClick}
      direction={direction}
      align={align}
      justify={justify}
      padding={padding}
      style={style}
      wrap={wrap}
      gap={gap}
    >
      {children}
    </FlexboxStyle>
  );
};

// Loader

const Loader = () => {
  return (
    <FlexBox align="center" justify="center">
      <i className="fa-3x fas fa-spinner fa-spin"></i>
    </FlexBox>
  );
};

// Rating

const Rating = ({rating}) => {
  const ratings = [];

  for (let i = 0; i < rating; i++) {
    ratings.push({
      color: "var(--cta)",
    });
  }

  if (ratings.length < 5) {
    const diff = 5 - ratings.length;
    for (let i = 0; i < diff; i++) {
      ratings.push({
        color: "#ccc",
      });
    }
  }

  return (
    <div>
      {ratings.map((r, index) => (
        <i
          className="fas fa-star"
          key={index}
          style={{color: r.color, fontSize: 24}}
        ></i>
      ))}
    </div>
  );
};

// Button

const Button = ({
                  success,
                  primary,
                  error,
                  onClick,
                  type = "submit",
                  disabled,
                  children,
                  style,
                  fullWidth,
                  loading,
                }) => {
  return (
    <ButtonStyle
      type={type}
      disabled={disabled || loading}
      primary={primary}
      success={success}
      error={error}
      onClick={onClick}
      style={style}
      fullWidth={fullWidth}
    >
      {loading && <i className="fas fa-spinner fa-spin"/>}
      {children}
    </ButtonStyle>
  );
};

// Card

const Card = ({dark, children, padding, color, width, margin}) => {
  return (
    <CardStyle
      dark={dark}
      padding={padding}
      color={color}
      width={width}
      margin={margin}
    >
      {children}
    </CardStyle>
  );
};

// Container

const Container = styled.div`
  width: 100%;
  @media screen and (min-width: 640px) {
    max-width: 640px;
  }
  @media screen and (min-width: 768px) {
    max-width: 768px;
  }
  @media screen and (min-width: 1024px) {
    max-width: 1024px;
  }
  @media screen and (min-width: 1280px) {
    max-width: 1280px;
  }
  @media screen and (min-width: 1536px) {
    max-width: 1536px;
  }
`;

// Badge

const BadgeStyle = styled.span`
  background-color: var(--primary);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  color: white;
  display: inline-block;

  & i {
    margin-left: 0.5rem;
    cursor: pointer;
  }
`;
const Badge = ({onClose, children}) => {
  return (
    <BadgeStyle>
      {children}
      {onClose ? <i className="fas fa-times" onClick={onClose}/> : ""}
    </BadgeStyle>
  );
};

// Fieldset

const FieldsetStyle = styled.fieldset`
  border: 1px solid #6e6e6e;
  padding: 1rem;

  & legend {
    color: ${(props) => (props.dark ? "white" : "black")};
  }
`;

const Fieldset = ({legend, children, dark}) => {
  return (
    <FieldsetStyle dark={dark}>
      <legend>{legend}</legend>
      {children}
    </FieldsetStyle>
  );
};

// UI

export const UI = {
  Card,
  Button,
  Rating,
  FlexBox,
  Loader,
  Spacer,
  Text,
  List,
  ListItem,
  Grid,
  Alert,
  Container,
  Badge,
  Fieldset,
};
