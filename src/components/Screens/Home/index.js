import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import MyModal from "./Modal";
import "./home.css";

import { UseStateValue } from "../../../stateProvider";
import { Link, useRouteMatch, Route, Switch } from "react-router-dom";

import { useParams } from "react-router-dom";
import { db, auth } from "../../../firebase";
import Loader from "../../SimpleComponents/Loader";

export default function Home() {
  const [{ users }, dispatch] = UseStateValue();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const handleLogout = (e) => {
    auth
      .signOut()
      .then(() => {})
      .catch((er) => {
        alert(er.message);
        e.preventDefault();
      });
  };

  const drop = (
    <div className="dropdown" style={{ display: isVisible ? "block" : "none" }}>
      <Link to="/" onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );

  useEffect(() => {
    // setLoading(true);
    db.collection("user").onSnapshot((snapshot) => {
      const loggedInUser = {
        ...snapshot.docs.map((doc) => ({
          name: doc.data().username,
          id: doc.id
        }))
      };
      //check to see if the logged in user is in the db
      if (users?.name === loggedInUser[0]?.name) {
        dispatch({
          type: "SET_USER",
          user: { name: loggedInUser[0]?.name, id: loggedInUser[0]?.id }
        });
        // setLoading(false);
        db.collection("user")
          .doc(loggedInUser[0]?.id)
          .collection("notes")
          .onSnapshot((snapShot) => {
            setNotes(snapShot.docs.map((doc) => ({ note: doc.data() })));
          });
      } else {
        setNotes([]);
        setLoading(false);
      }
    });
    setLoading(false);
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
            {loading ? (
              <Loader size="small" />
            ) : (
              notes?.map((note) => (
                <li key={note.note.id}>
                  <Link to={`${url}/${note.note.id}`}>{note.note.title}</Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/* read mode */}
      <div className="home__read">
        <Switch>
          <Route exact path={path}>
            <div className="read__header">
              <h2>Open Your note</h2>
              <div className="header__buttons">
                <div
                  onClick={() => setOpen(true)}
                  className="add__icon"
                  title="Add New Note">
                  <AddIcon />
                </div>
                <div
                  onClick={() => setIsVisible(!isVisible)}
                  className="add__logout"
                  title="Add New Note">
                  {/* {users[0]} */}
                </div>
                {drop}
              </div>
            </div>
          </Route>
          <Route path={`${path}/:noteID`}>
            <Read
              setOpen={setOpen}
              notes={notes}
              drop={drop}
              setIsVisible={setIsVisible}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

const Read = ({ setOpen, notes, drop, setIsVisible }) => {
  const [{ users }] = UseStateValue();
  console.log(users);
  const { noteID } = useParams();

  let note = notes.filter((note) => note.note.id === noteID);

  return (
    <>
      <div className="read__header">
        <h2>{note[0]?.note.title}</h2>
        <div className="header__buttons">
          <div
            onClick={() => setOpen(true)}
            className="add__icon"
            title="Add New Note">
            <AddIcon />
          </div>
          <div
            onClick={setIsVisible(true)}
            className="add__logout"
            title="Add New Note">
            {users.name[0]}
          </div>
          {drop}
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
