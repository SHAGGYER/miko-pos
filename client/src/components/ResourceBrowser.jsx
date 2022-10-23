import React, { useContext, useEffect, useState } from "react";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import ProductForm from "../components/ProductForm";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import ProductsContainer from "../components/ProductsContainer";
import DataTable from "react-data-table-component";
import { HttpClient } from "../utilities/HttpClient";

export const RESOURCE_MODE = {
  VIEW: "view",
  UPDATE: "update",
};

const CreateDialog = ({ component: Component }) => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component onCreated={(product) => dialog.close(product)} />
    </div>
  );
};

const ViewDialog = ({ component: Component, ...props }) => {
  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component {...props} mode={RESOURCE_MODE.VIEW} />
    </div>
  );
};

const EditDialog = ({ product, component: Component }) => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <Component row={product} onUpdated={(product) => dialog.close(product)} />
    </div>
  );
};

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: 500,
        }}
      >
        <FloatingTextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Søg..."
        />
        <PrimaryButton onClick={doSearch}>Søg</PrimaryButton>
      </div>
      <div style={{ flex: 1 }}></div>
    </>
  );
};

function ResourceBrowser({
  shop,
  selectMode,
  createComponent,
  editComponent,
  viewComponent,
  url,
  title,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [toggleCleared, setToggleCleared] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([...props.columns]);

  useEffect(() => {
    setColumns([
      ...columns,
      {
        name: "Actions",
        selector: "actions",
        cell: (row) =>
          !selectMode ? (
            <div className="flex gap-1">
              <PrimaryButton onClick={() => openEditDialog(row)}>
                Edit
              </PrimaryButton>
              <PrimaryButton onClick={() => openViewDialog(row)}>
                View
              </PrimaryButton>
            </div>
          ) : (
            <PrimaryButton onClick={() => props.onSelect(row)}>
              Select
            </PrimaryButton>
          ),
      },
    ]);
    fetchRows(1);
  }, [selectMode]);

  const openCreateDialog = async () => {
    const result = await CustomDialog(
      <CreateDialog component={createComponent} />
    );
    if (result) {
      setRows([...rows, result]);
    }
  };

  const openEditDialog = async (product) => {
    const result = await CustomDialog(
      <EditDialog component={editComponent} product={product} />
    );
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const openViewDialog = async (row) => {
    await CustomDialog(
      <ViewDialog shop={shop} component={editComponent} row={row} />
    );
  };

  const fetchRows = async (page, searchQuery = "") => {
    setLoading(true);
    setCurrentPage(page);

    const response = await HttpClient().get(
      `${url}?page=${page}&search=${searchQuery}`
    );

    setRows(response.data.content);
    setTotalRows(response.data.totalRows);

    setLoading(false);
  };

  const handlePageChange = async (page) => {
    await fetchRows(page, search);
  };

  const doSearch = async () => {
    await fetchRows(1, search);
  };

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  const deleteSelectedRows = async () => {
    const result = await Confirm(
      "You are about to remove this user's account.",
      "Please Confirm."
    );
    if (result) {
      const ids = selectedRows.map((x) => x._id);
      await HttpClient().post(`${url}/delete`, { ids });
      await fetchRows(currentPage, search);
      setToggleCleared(!toggleCleared);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <div className="flex gap-1 items-center w-full justify-between">
        <span>{selectedCount} rows</span>
        <PrimaryButton onClick={() => deleteSelectedRows()}>
          Delete
        </PrimaryButton>
      </div>
    );
  };

  return (
    <Page>
      {!selectMode && (
        <PrimaryButton onClick={openCreateDialog}>New Contact</PrimaryButton>
      )}

      <div className="mt-4">
        <DataTable
          title={title}
          columns={columns}
          data={rows.filter((x) => !x.deletedAt)}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          clearSelectedRows={toggleCleared}
          onChangePage={handlePageChange}
          selectableRows={!selectMode ?? true}
          onSelectedRowsChange={handleSelectedRows}
          contextComponent={<DeleteSelectedRowsAction />}
          subHeader
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10]}
          subHeaderComponent={
            <SearchComponent
              search={search}
              setSearch={setSearch}
              doSearch={doSearch}
            />
          }
        />
      </div>
    </Page>
  );
}

export default ResourceBrowser;
