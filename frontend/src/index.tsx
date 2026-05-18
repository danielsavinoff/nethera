/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Navigate, Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { LocaleProvider } from "./context/Locale";
import {
  ColorModeProvider,
  ColorModeScript,
  localStorageManager,
} from "@kobalte/core";

const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));
const App = lazy(() => import("./pages/App"));
const Plans = lazy(() => import("./pages/Plans"));
const Settings = lazy(() => import("./pages/Settings"));
const Billing = lazy(() => import("./pages/Billing"));

const Protected = lazy(() => import("./layouts/Protected"));
const Default = lazy(() => import("./layouts/Default"));
const Scrollable = lazy(() => import("./layouts/Scrollable"));

render(
  () => (
    <>
      <ColorModeScript storageType={localStorageManager.type} />
      <ColorModeProvider storageManager={localStorageManager}>
        <LocaleProvider>
          <Router>
            <Route path={"/login"} component={Login} />
            <Route component={Protected}>
              <Route component={Default}>
                <Route
                  path={"/"}
                  component={() => <Navigate href="/subscription" />}
                />
                <Route path={"/subscription"} component={App} />
                <Route path={"/plans"} component={Plans} />
                <Route path={"/billing"} component={Billing} />
              </Route>
              <Route component={Scrollable}>
                <Route path={"/settings"} component={Settings} />
              </Route>
            </Route>
          </Router>
        </LocaleProvider>
      </ColorModeProvider>
    </>
  ),
  root!,
);
