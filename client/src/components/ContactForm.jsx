import React, { useState } from "react";
import FloatingTextField from "./FloatingTextField";
import { PrimaryButton } from "./PrimaryButton";
import { HttpClient } from "../utilities/HttpClient";
import FloatingTextArea from "./FloatingTextArea";

function ContactForm({ row, onCreated, onUpdated }) {
  const [name, setName] = useState(row ? row.name : "");
  const [email, setEmail] = useState(row ? row.email : "");
  const [note, setNote] = useState(row ? row.note : "");
  const [showNote, setShowNote] = useState(row ? !!row.note : false);
  const [error, setError] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    setError({});
    try {
      const body = {
        name,
        email,
        note,
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

        {(showNote || !!note) && (
          <FloatingTextArea
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}

        <div className="flex gap-1">
          <PrimaryButton>Save</PrimaryButton>
          {(showNote || note) && (
            <PrimaryButton
              type="button"
              onClick={() => {
                setShowNote(false);
                setNote("");
              }}
            >
              Close Note
            </PrimaryButton>
          )}
          {!showNote && !note && (
            <PrimaryButton onClick={() => setShowNote(true)} type="button">
              Note
            </PrimaryButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
