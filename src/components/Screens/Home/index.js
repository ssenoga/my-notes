import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MyModal from "./Modal";
import "./home.css";

import { UseStateValue } from "../../../stateProvider";
import { Link, useRouteMatch, Route, Switch } from "react-router-dom";

import { useParams } from "react-router-dom";

export default function Home() {
  const [{ user }] = UseStateValue();
  const [open, setOpen] = useState(false);

  const handleOpen = (x) => setOpen(x);
  let { path, url } = useRouteMatch();
  return (
    <div className="home">
      <MyModal open={open} handleOpen={handleOpen} />
      {/* notes list */}
      <div className="home__left">
        <div className="home__form">
          <form>
            <input type="search" className="search__input" />
            <button className="search__button">Search</button>
          </form>
        </div>
        <div className="list__header">
          <h3>All Notes</h3>
        </div>
        <div className="list">
          <ul>
            {user?.notes.map((note) => (
              <li key={note.id}>
                <Link to={`${url}/${note.id}`}>{note.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* read mode */}
      <div className="home__read">
        <Switch>
          <Route exact path={path}>
            <div className="read__header">
              <h2>Open Your note</h2>
              <div
                onClick={() => setOpen(true)}
                className="add__icon"
                title="Add New Note">
                <AddIcon />
              </div>
            </div>
          </Route>
          <Route path={`${path}/:noteID`}>
            <Read setOpen={setOpen} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

const Read = ({ setOpen }) => {
  const [{ user }] = UseStateValue();
  const { noteID } = useParams();
  let note = user.notes.filter((note) => note.id === noteID);

  console.log(user.notes[0]);
  console.log(note);
  return (
    <>
      <div className="read__header">
        <h2>{note[0]?.title}</h2>
        <div
          onClick={() => setOpen(true)}
          className="add__icon"
          title="Add New Note">
          <AddIcon />
        </div>
      </div>
      <div className="read__category">
        <h4>
          {note[0]?.category} <sup>.</sup> 2020/08/12
        </h4>
      </div>
      <div className="read__content">
        <p>{note[0]?.content}</p>
      </div>
    </>
  );
};
