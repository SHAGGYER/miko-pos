import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";

function StorageForm({ row, onCreated, onUpdated }) {
  const [title, setTitle] = useState(row ? row.title : "");
  const [error, setError] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    try {
      const body = {
        title,
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/storage", body);
        onCreated(data.content);
      } else {
        await HttpClient().put(`/api/storage/${row._id}`, body);
        onUpdated({ ...row, ...body });
      }
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError(e.response.data.errors);
      }
    }
  };

  return (
    <div className="p-4">
      <h2>{row ? "Update" : "Create"} Storage</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-start gap-4">
        <FloatingTextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error.title}
          width="100%"
        />
        <PrimaryButton>Save</PrimaryButton>
      </form>
    </div>
  );
}

export default StorageForm;
