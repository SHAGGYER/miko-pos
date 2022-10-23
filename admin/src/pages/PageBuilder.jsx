import React, { useState } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import PrimaryButton from "../components/UI/PrimaryButton";
import Contact from "../components/widgets/Contact";
import WidgetMenu from "../components/WidgetMenu";

export const WIDGETS = {};
WIDGETS["ContactUs"] = Contact;

const RowStyled = styled.div`
  position: relative;
  border: 1px dashed #bebebe;
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 1fr);
`;

const RowsContainer = styled.div`
  .row {
    .column {
      position: relative;
      border: 1px dashed #bebebe;

      .widget {
        position: relative;
        border: 1px dashed #bebebe;
      }
    }
  }

  .settings-btn {
    position: absolute;
  }
`;

export function Widget({ type, ...props }) {
  const Component = WIDGETS[type];
  return <Component {...props} />;
}

function PageBuilder(props) {
  const [rows, setRows] = useState([]);

  const addNewRow = async (size) => {
    const _rows = [...rows];
    const newRow = {
      style: {
        padding: "1rem",
      },
      columns: [],
    };

    for (let i = 0; i < size; i++) {
      newRow.columns.push({
        widgets: [],
      });
    }
    setRows([...rows, newRow]);

    // todo: add draft to server
  };

  const getWidgetContentByType = (type) => {
    return WIDGETS[type];
  };

  const addNewColumn = async (rowIndex, size) => {
    const _rows = [...rows];
    for (let i = 0; i < size; i++) {
      _rows[rowIndex].columns.push({
        widgets: [],
      });
    }
    setRows(_rows);
  };

  function addNewWidget(rowIndex, columnIndex, widget) {
    const _rows = [...rows];
    _rows[rowIndex].columns[columnIndex].widgets.push({
      type: widget,
    });
    setRows(_rows);
  }

  return (
    <Page>
      <PrimaryButton onClick={() => addNewRow(1)}>New Row 1x1</PrimaryButton>
      <PrimaryButton onClick={() => addNewRow(2)}>New Row 2x1</PrimaryButton>
      <RowsContainer>
        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <PrimaryButton onClick={() => addNewColumn(rowIndex, 1)}>
              Add Column
            </PrimaryButton>
            <RowStyled
              size={row.columns.length}
              className="row"
              style={{ ...row.style }}
            >
              {row.columns.map((column, columnIndex) => (
                <article
                  className="column"
                  key={columnIndex}
                  style={{ ...row.style }}
                >
                  <WidgetMenu
                    onSelected={(widget) =>
                      addNewWidget(rowIndex, columnIndex, widget)
                    }
                  />
                  {column.widgets.map((widget, widgetIndex) => (
                    <article
                      key={widgetIndex}
                      style={{ ...widget.style }}
                      className="widget"
                    >
                      <Widget type={widget.type} />
                    </article>
                  ))}
                </article>
              ))}
            </RowStyled>
          </React.Fragment>
        ))}
      </RowsContainer>
    </Page>
  );
}

export default PageBuilder;
