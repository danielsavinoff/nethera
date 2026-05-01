/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Navigate, Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { LocaleProvider } from "./context/Locale";

const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));
const App = lazy(() => import("./pages/App"));
const Plans = lazy(() => import("./pages/Plans"));
const Default = lazy(() => import("./layouts/Default"));

render(
  () => (
    <LocaleProvider>
      <Router>
        <Route
          path={"/"}
          component={() => <Navigate href="/app/subscription" />}
        />
        <Route path={"/plans"} component={() => <Navigate href="/app/plans" />} />
        <Route path={"/login"} component={Login} />
        <Route path={"/app"} component={Default}>
          <Route
            path={"/"}
            component={() => <Navigate href="/app/subscription" />}
          />
          <Route path={"/subscription"} component={App} />
          <Route path={"/plans"} component={Plans} />
        </Route>
      </Router>
    </LocaleProvider>
  ),
  root!,
);
