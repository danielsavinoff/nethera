/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));
const App = lazy(() => import("./pages/App"));

render(
  () => (
    <Router>
      <Route path={"/"} component={App} />
      <Route path={"/login"} component={Login} />
    </Router>
  ),
  root!,
);
