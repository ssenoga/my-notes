import React, { useState, useEffect } from "react";
import Loader from "../SimpleComponents/Loader";
import "./login.css";
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
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  //error handler
  const [empyEmail, setEmptyEmail] = useState(false);
  const [empyPassword, setEmptyPassword] = useState(false);
  const [, dispatch] = UseStateValue();

  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/home" } };

  //check if user has already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        setUser(authUser.displayName);
        console.log(authUser);
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

    if (email === "" || validateEmail(email) === false) {
      setEmptyEmail(true);
    }
    if (password === "") {
      setEmptyPassword(true);
    }

    //check to see if all field are not empty
    if (!empyEmail && !empyPassword) {
      //proceeed to submit the form
      setLoading(true);

      auth
        .signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          if (authUser) {
            setLoading(false);
            dispatch({
              type: "user_loggedin"
            });
          }
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
        });

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="login">
      <div className="login__header">
        <h1>Log into your account</h1>
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
          Keep me signed in
        </p>
        <div className="buttons__flex">
          <button
            type="submit"
            className="input__button"
            disabled={!checked}
            onClick={handleSubmit}>
            LOGIN
            {loading && <Loader size={"small"} />}
          </button>
          <p>OR</p>
          <Link className="input__button btn__primary" to="/signup">
            SIGNUP
          </Link>
        </div>
      </form>
    </div>
  );
}
