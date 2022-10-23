import styled from "styled-components";

export const Pagination = styled.div`
  .pagination {
    display: flex;
    list-style-type: none;
    gap: 0.1rem;
  }

  a {
    padding: 1rem;
    display: block;
  }

  .page-item {
    border: 1px solid #0c5460;
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
      color: #ccc;
    }

    &.active {
      background-color: #0c5460;
      color: white;
    }
  }
`;
