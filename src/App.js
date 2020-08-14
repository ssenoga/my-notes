import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import "./styles.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Screens/Home";
import { UseStateValue } from "./stateProvider";

export default function App() {
  const [{ authenticated }] = UseStateValue();

  return (
    <Router>
      <Switch>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        <ProtectedRoute authenticated={authenticated} path="/home">
          <Home />
        </ProtectedRoute>
      </Switch>
    </Router>
  );
}

const ProtectedRoute = ({ authenticated, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        )
      }
    />
  );
};
