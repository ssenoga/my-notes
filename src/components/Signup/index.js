import React, { useState, useEffect } from "react";
import Loader from "../SimpleComponents/Loader";
import "./signup.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import { UseStateValue } from "../../stateProvider";

export default function Signup() {
  //email regx
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/home" } };

  const [, dispatch] = UseStateValue();

  //error handler
  const [emptyName, setEmptyName] = useState(false);
  const [empyEmail, setEmptyEmail] = useState(false);
  const [empyPassword, setEmptyPassword] = useState(false);

  //check if user has already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        setUser(authUser.displayName);
        dispatch({
          type: "SET_USER",
          user: user
        });
        history.replace(from);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      //do some clean ups
      unsubscribe();
    };
  }, [user, dispatch, from, history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // check for empty fields
    if (username === "") {
      setEmptyName(true);
    }
    if (email === "" || validateEmail(email) === false) {
      setEmptyEmail(true);
    }
    if (password === "") {
      setEmptyPassword(true);
    }

    //check to see if all field are not empty
    if (!emptyName && !empyEmail && !empyPassword) {
      //proceeed to submit the form

      setLoading(true);
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          setLoading(false);
          //dispatch an action
          dispatch({
            type: "user_loggedin"
          });

          history.replace(from);

          return authUser.user.updateProfile({ displayName: username });
        })
        .catch((err) => {
          setLoading(false);
          return alert(err.message);
        });
    }
  };

  return (
    <div className="login">
      <div className="login__header">
        <h1>Signup your free account</h1>
      </div>
      <form className="login__form">
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            style={{ borderColor: empyEmail && "error" }}
            value={email}
            id="email"
            type="email"
            placeholder="Enter your email.."
            className="input__field"
            required={true}
            onChange={(e) => {
              setEmptyEmail(false);
              setEmail(e.target.value);
            }}
          />
          {empyEmail ? <p className="error">Invalid Email Address</p> : null}
        </div>
        <div className="form__group">
          <label htmlFor="username">Username</label>
          <input
            style={{ borderColor: emptyName && "error" }}
            value={username}
            id="username"
            type="text"
            placeholder="Enter your username.."
            className="input__field"
            required={true}
            onChange={(e) => {
              setEmptyName(false);
              setUsername(e.target.value);
            }}
          />
          {emptyName ? (
            <p className="error">Please provide a username</p>
          ) : null}
        </div>
        <div className="form__group">
          <label htmlFor="password">Password</label>
          <input
            style={{ borderColor: empyPassword && "error" }}
            value={password}
            id="password"
            type="password"
            placeholder="Enter your password.."
            className="input__field"
            required={true}
            onChange={(e) => {
              setEmptyPassword(false);
              setPassword(e.target.value);
            }}
          />
          {empyPassword ? <p className="error">Empty Password field</p> : null}
        </div>
        <p>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          On signing up you agree to all our terms and conditions
        </p>
        <div className="buttons__flex">
          <button
            type="submit"
            className="input__button"
            disabled={!checked}
            onClick={handleSubmit}>
            SIGNUP
            {loading && <Loader size={"small"} />}
          </button>
          <p>OR</p>
          <Link className="input__button btn__primary" to="/">
            LOGIN
          </Link>
        </div>
      </form>
    </div>
  );
}
