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

const Default = lazy(() => import("./layouts/Default"));
const Scrollable = lazy(() => import("./layouts/Scrollable"));

render(
  () => (
    <>
      <ColorModeScript storageType={localStorageManager.type} />
      <ColorModeProvider storageManager={localStorageManager}>
        <LocaleProvider>
          <Router>
            <Route
              path={"/"}
              component={() => <Navigate href="/app/subscription" />}
            />
            <Route
              path={"/plans"}
              component={() => <Navigate href="/app/plans" />}
            />
            <Route path={"/login"} component={Login} />
            <Route path={"/app"} component={Default}>
              <Route
                path={"/"}
                component={() => <Navigate href="/app/subscription" />}
              />
              <Route path={"/subscription"} component={App} />
              <Route path={"/plans"} component={Plans} />
            </Route>
            <Route path={"/app"} component={Scrollable}>
              <Route path={"/settings"} component={Settings} />
            </Route>
          </Router>
        </LocaleProvider>
      </ColorModeProvider>
    </>
  ),
  root!,
);
