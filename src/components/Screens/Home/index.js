import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MyModal from "./Modal";
import "./home.css";

import { UseStateValue } from "../../../stateProvider";
import { Link, useRouteMatch, Route, Switch } from "react-router-dom";

import { useParams } from "react-router-dom";
import { db } from "../../../firebase";

export default function Home() {
  const [{ users }, dispatch] = UseStateValue();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    db.collection("user").onSnapshot((snapshot) => {
      const loggedInUser = {
        ...snapshot.docs.map((doc) => ({
          name: doc.data().username,
          id: doc.id
        }))
      };

      //check to see if the logged in user is in the db
      if (users === loggedInUser[0]?.name) {
        dispatch({
          type: "SET_USER",
          user: { name: loggedInUser[0]?.name, id: loggedInUser[0]?.id }
        });
        db.collection("user")
          .doc(loggedInUser[0].id)
          .collection("notes")
          .onSnapshot((snapShot) => {
            setNotes(snapShot.docs.map((doc) => ({ note: doc.data() })));
          });
      } else {
        setNotes([]);
      }
    });
  }, [users, dispatch]);

  // notes.map((note) => console.log(note.note));

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
            {notes?.map((note) => (
              <li key={note.note.id}>
                <Link to={`${url}/${note.note.id}`}>{note.note.title}</Link>
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
            <Read setOpen={setOpen} notes={notes} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

const Read = ({ setOpen, notes }) => {
  // const [{ user }] = UseStateValue();
  const { noteID } = useParams();
  let note = notes.filter((note) => note.note.id === noteID);

  return (
    <>
      <div className="read__header">
        <h2>{note[0]?.note.title}</h2>
        <div
          onClick={() => setOpen(true)}
          className="add__icon"
          title="Add New Note">
          <AddIcon />
        </div>
      </div>
      <div className="read__category">
        <h4>
          {note[0]?.note.category} <sup>.</sup> 2020/08/12
        </h4>
      </div>
      <div className="read__content">
        <p>{note[0]?.note.content}</p>
      </div>
    </>
  );
};
