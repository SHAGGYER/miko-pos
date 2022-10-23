import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import HttpClient from "../services/HttpClient";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import { UI } from "../components/UI/UI";
import { Form } from "../components/UI/Form";
import moment from "moment";
import PrimaryButton from "../components/UI/PrimaryButton";
import FloatingTextField from "shaggyer-cmps/src/FloatingTextField";
import EditUserDialog from "../components/EditUserDialog";
import shortid from "shortid";

const NewUserDialog = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempPassword, setTempPassword] = useState(shortid.generate());

  const dialog = useDialog();

  const onSubmit = async () => {
    const tempPassword = shortid.generate();

    const body = {
      name,
      email,
      password: tempPassword,
      passwordAgain: tempPassword,
    };

    const { data } = await HttpClient().post("/api/user", body);
    dialog.close(data.user);
  };

  const generatePassword = () => {
    setTempPassword(shortid.generate());
  };

  return (
    <div style={{ padding: "1rem" }}>
      <FloatingTextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FloatingTextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
        <PrimaryButton onClick={generatePassword}>Generate</PrimaryButton>

        <FloatingTextField
          label="Password"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
        />
      </div>

      <PrimaryButton onClick={onSubmit}>Opret</PrimaryButton>
    </div>
  );
};

const SearchComponent = ({ search, setSearch, doSearch }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Form.TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søg..."
      />
      <PrimaryButton onClick={doSearch}>Søg</PrimaryButton>
    </div>
  );
};

function Users(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [toggleCleared, setToggleCleared] = useState(false);

  const [columns, setColumns] = useState([
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Created At",
      selector: "createdAt",
      sortable: true,
      format: (row) => moment(row.createdAt).format("DD-MM-YYYY"),
    },
    {
      name: "Login",
      button: true,
      cell: (row) => (
        <PrimaryButton onClick={() => loginAsUser(row)}>Login</PrimaryButton>
      ),
    },
    {
      name: "Redigér",
      button: true,
      cell: (row) => (
        <PrimaryButton onClick={() => openEditUserDialog(row)}>
          Redigér
        </PrimaryButton>
      ),
    },
  ]);

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const loginAsUser = async (row) => {
    const body = {
      userId: row._id,
    };

    const { data } = await HttpClient().post(
      "/api/admin/auth/login-as-user",
      body
    );

    window.open(
      import.meta.env.VITE_CLIENT_URL + "?adminAsUserToken=" + data.token
    );
  };

  const fetchUsers = async (page, searchQuery = "") => {
    setLoading(true);

    const response = await HttpClient().get(
      `/api/admin/users?page=${page}&per_page=${perPage}&search=${searchQuery}`
    );

    setData(response.data.users);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await HttpClient().get(
      `/api/admin/users?page=${page}&per_page=${newPerPage}`
    );

    setData(response.data.users);
    setPerPage(newPerPage);
    setLoading(false);
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
      await HttpClient().post("/api/admin/users/delete", { ids });
      const newData = data.filter((x) => !ids.includes(x._id));
      setData(newData);
      setToggleCleared(!toggleCleared);
    }
  };

  const DeleteSelectedRowsAction = ({ selectedCount }) => {
    return (
      <UI.FlexBox justify="space-between" align="center">
        <span>{selectedCount} rows</span>
        <UI.Button error onClick={() => deleteSelectedRows()}>
          Delete
        </UI.Button>
      </UI.FlexBox>
    );
  };

  const doSearch = async () => {
    await fetchUsers(1, search);
  };

  const openCreateUserDialog = async () => {
    const result = await CustomDialog(<NewUserDialog />);
    if (result) {
      setData([...data, result]);
    }
  };

  const openEditUserDialog = async (row) => {
    const result = await CustomDialog(<EditUserDialog userId={row._id} />, {
      className: "big-modal",
    });
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <PrimaryButton onClick={openCreateUserDialog}>Opret bruger</PrimaryButton>

      <DataTable
        title="Brugere"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        clearSelectedRows={toggleCleared}
        onChangePage={handlePageChange}
        selectableRows
        onChangeRowsPerPage={handlePerRowsChange}
        onSelectedRowsChange={handleSelectedRows}
        contextComponent={<DeleteSelectedRowsAction />}
        subHeader
        paginationPerPage={15}
        paginationRowsPerPageOptions={[15, 30]}
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

export default Users;
