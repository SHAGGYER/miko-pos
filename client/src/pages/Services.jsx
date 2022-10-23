import React, { useContext, useEffect, useState } from "react";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import FloatingTextField from "../components/FloatingTextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import DataTable from "react-data-table-component";
import ServiceForm from "../components/ServiceForm";

const CreateServiceDialog = () => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <ServiceForm onCreated={(product) => dialog.close(product)} />
    </div>
  );
};

const EditServiceDialog = ({ product }) => {
  const dialog = useDialog();

  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      <ServiceForm
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

function Services(props) {
  const [loading, setLoading] = useState(false);
  const [products, setServices] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "SKU",
      selector: "sku",
      sortable: true,
    },
    {
      name: "Sell Price",
      selector: "sell_price",
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <PrimaryButton onClick={() => openEditDialog(row)}>Edit</PrimaryButton>
      ),
    },
  ]);

  useEffect(() => {
    fetchRows(1);
  }, []);

  const deleteSelectedRows = async () => {
    const result = await Confirm(
      "You are about to remove this user's account.",
      "Please Confirm."
    );
    if (result) {
      const ids = selectedRows.map((x) => x._id);
      await HttpClient().post("/api/services/delete", { ids });
      await fetchRows(currentPage, search);
      setToggleCleared(!toggleCleared);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <div className="flex gap-4">
        <span>{selectedCount} rows</span>
        <PrimaryButton onClick={() => deleteSelectedRows()}>
          Delete
        </PrimaryButton>
      </div>
    );
  };

  const doSearch = async () => {
    await fetchRows(1, search);
  };

  const fetchRows = async (page, searchQuery = "") => {
    setLoading(true);
    setCurrentPage(page);

    const response = await HttpClient().get(
      `/api/services?page=${page}&search=${searchQuery}`
    );

    setServices(response.data.content);
    setTotalRows(response.data.totalRows);
    setLoading(false);
  };

  const handlePageChange = async (page) => {
    await fetchRows(page, search);
  };
  const openServiceForm = async () => {
    const result = await CustomDialog(<CreateServiceDialog />, {
      className: "big-dialog",
    });
    if (result) {
      setServices([...products, result]);
    }
  };

  const openEditDialog = async (product) => {
    const result = await CustomDialog(<EditServiceDialog product={product} />, {
      className: "big-dialog",
    });
    console.log(result);
    if (result) {
      await fetchRows(currentPage, search);
    }
  };

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  return (
    <Page>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <h1>Services</h1>
          <PrimaryButton onClick={openServiceForm}>New Service</PrimaryButton>

          <DataTable
            title=" "
            columns={columns}
            data={products.filter((x) => !x.deletedAt)}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            clearSelectedRows={toggleCleared}
            onChangePage={handlePageChange}
            selectableRows
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
        </>
      )}
    </Page>
  );
}

export default Services;
