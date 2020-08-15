import React, { useState } from "react";
import { Modal } from "@material-ui/core";
import { v4 } from "uuid";

import { UseStateValue } from "../../../stateProvider";
import { db } from "../../../firebase";

export default function MyModal({ open, handleOpen }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const [{ users }, dispatch] = UseStateValue();

  const handleOnClick = (e) => {
    e.preventDefault();
    const id = v4();

    db.collection("user").doc(users.id).collection("notes").add({
      id,
      title,
      category,
      content
    });

    dispatch({
      type: "ADD_NEW_NOTE",
      note: {
        id,
        title,
        category,
        content
      }
    });

    handleOpen(false);
  };

  return (
    <Modal
      style={{ border: 0, outline: 0 }}
      open={open}
      onClose={() => handleOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">
      <div className="modal">
        <h2>Add New Note</h2>
        <form className="login__form">
          <div className="form__group">
            <label htmlFor="title">Title</label>
            <input
              value={title}
              id="title"
              type="text"
              placeholder="Enter notes title..."
              className="input__field"
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form__group">
            <label htmlFor="category">Category</label>
            <input
              value={category}
              id="category"
              type="text"
              placeholder="Enter the category..."
              className="input__field"
              required={true}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form__group">
            <label htmlFor="content">Content</label>
            <textarea
              rows="10"
              className="input__field"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}></textarea>
          </div>
          <button
            type="submit"
            className="input__button"
            onClick={handleOnClick}>
            ADD NOTE
          </button>
        </form>
      </div>
    </Modal>
  );
}
