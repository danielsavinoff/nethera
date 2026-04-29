/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));
const App = lazy(() => import("./pages/App"));
const Plans = lazy(() => import("./pages/Plans"));

render(
  () => (
    <Router>
      <Route path={"/"} component={App} />
      <Route path={"/login"} component={Login} />
      <Route path={"/plans"} component={Plans} />
    </Router>
  ),
  root!,
);
