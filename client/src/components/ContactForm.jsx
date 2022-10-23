import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";

function ContactForm({ row, onCreated, onUpdated }) {
  const [name, setName] = useState(row ? row.name : "");
  const [email, setEmail] = useState(row ? row.email : "");
  const [error, setError] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    try {
      const body = {
        name,
        email,
      };

      if (!row?._id) {
        const { data } = await HttpClient().post("/api/contacts", body);
        onCreated(data.content);
      } else {
        await HttpClient().put(`/api/contacts/${row._id}`, body);
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
      <h2>{row ? "Update" : "Create"} Contact</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-start gap-4">
        <FloatingTextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error.name}
          width="100%"
        />
        <FloatingTextField
          label="Email"
          value={email}
          error={error.email}
          onChange={(e) => setEmail(e.target.value)}
          width="100%"
        />
        <PrimaryButton>Save</PrimaryButton>
      </form>
    </div>
  );
}

export default ContactForm;
