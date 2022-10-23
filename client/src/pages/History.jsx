import React, { useEffect, useState } from "react";
import { HttpClient } from "../utilities/HttpClient";
import { Page } from "../components/Page";
import { Table } from "../components/Table";
import moment from "moment";
import { PrimaryButton } from "../components/PrimaryButton";
import { Pagination } from "../components/Pagination";
import ReactPaginate from "react-paginate";
import { Confirm } from "react-st-modal";
import cogoToast from "cogo-toast";

function History(props) {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const { data } = await HttpClient().get("/api/history");
    setItems(data.data);
    setTotalItems(data.total);
    setPerPage(data.per_page);
  };

  const handlePageClick = async (page) => {
    const { data } = await HttpClient().get(
      "/api/history?page=" + (page.selected + 1)
    );
    setItems(data.data);
  };

  const revert = async (item) => {
    const result = await Confirm(
      "You are about to revert this item",
      "Are you sure?"
    );
    if (result) {
      await HttpClient().post(`/api/history/revert/${item.id}`, {});
      cogoToast.success("Reverted successfully");
      await getItems();
    }
  };

  return (
    <Page>
      <h1>History</h1>

      {!items.length ? (
        <div>No history yet.</div>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <td>Type</td>
                <td>Amount</td>
                <td>Date</td>
                <td>Description</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: 300 }}>{item.type}</td>
                  <td style={{ width: 125 }}>{item.total?.toFixed(2)}</td>
                  <td style={{ width: 200 }}>
                    {moment(item.created_at).format("DD-MM-YYYY")}
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <PrimaryButton onClick={() => revert(item)}>
                      Revert
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <ReactPaginate
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(totalItems / perPage)}
              nextLabel="next >"
              previousLabel="< previous"
              pageClassName="page-item"
              previousClassName="page-item"
              nextClassName="page-item"
              breakLabel="..."
              breakClassName="page-item"
              containerClassName="pagination"
              activeClassName="active"
            />
          </Pagination>
        </>
      )}
    </Page>
  );
}

export default History;
