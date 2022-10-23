import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import { HttpClient } from "../utilities/HttpClient";
import { PrimaryButton } from "./PrimaryButton";
import FloatingTextField from "./FloatingTextField";
import ProductForm from "./ProductForm";

const CreateProductDialog = () => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <ProductForm onCreated={(product) => dialog.close(product)} />
    </div>
  );
};

const EditProductDialog = ({ product }) => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <ProductForm
        row={product}
        onUpdated={(product) => dialog.close(product)}
      />
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

function ProductsContainer(props) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [columns, setColumns] = useState([...props.columns]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [toggleCleared, setToggleCleared] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setColumns([
      ...columns,
      {
        name: "Actions",
        selector: "actions",
        cell: (row) =>
          !props.selectMode ? (
            <PrimaryButton onClick={() => openEditDialog(row)}>
              Edit
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => props.onSelect(row)}>
              Select
            </PrimaryButton>
          ),
      },
    ]);
    fetchRows(1);
  }, []);

  const openProductForm = async () => {
    const result = await CustomDialog(<CreateProductDialog />);
    if (result) {
      setProducts([...products, result]);
    }
  };

  const openEditDialog = async (product) => {
    const result = await CustomDialog(<EditProductDialog product={product} />);
    console.log(result);
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const fetchRows = async (page, searchQuery = "") => {
    setLoading(true);
    setCurrentPage(page);

    const response = await HttpClient().get(
      `/api/products?page=${page}&search=${searchQuery}`
    );

    setProducts(response.data.content);
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
      await HttpClient().post("/api/products/delete-products", { ids });
      await fetchRows(currentPage, search);
      setToggleCleared(!toggleCleared);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <div className="flex gap-1 items-center">
        <span>{selectedCount} rows</span>
        <PrimaryButton onClick={() => deleteSelectedRows()}>
          Delete
        </PrimaryButton>
      </div>
    );
  };
  return (
    <div>
      {!props.selectMode && (
        <PrimaryButton onClick={openProductForm}>New Product</PrimaryButton>
      )}
      <DataTable
        columns={columns}
        data={products.filter((x) => !x.deletedAt)}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        clearSelectedRows={toggleCleared}
        onChangePage={handlePageChange}
        selectableRows={!props.selectMode ?? true}
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
  );
}

export default ProductsContainer;
