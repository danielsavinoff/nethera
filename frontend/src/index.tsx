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
import { AuthProvider } from "./context/Auth";
import { Toaster } from "./components/ui/Toast";
import { SubscriptionProvider } from "./context/Subscription";
import { VpnSubscriptionProvider } from "./context/VpnSubscription";

const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Plans = lazy(() => import("./pages/Plans"));
const Settings = lazy(() => import("./pages/Settings"));
const Invoices = lazy(() => import("./pages/Invoices"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Download = lazy(() => import("./pages/Download"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Protected = lazy(() => import("./layouts/Protected"));
const Default = lazy(() => import("./layouts/Default"));
const Scrollable = lazy(() => import("./layouts/Scrollable"));
const GuestOnly = lazy(() => import("./layouts/GuestOnly"));
const SubscriptionRequired = lazy(
  () => import("./layouts/SubscriptionRequired"),
);

render(
  () => (
    <>
      <ColorModeScript storageType={localStorageManager.type} />
      <ColorModeProvider storageManager={localStorageManager}>
        <LocaleProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <VpnSubscriptionProvider>
                <Router>
                  <Route component={GuestOnly}>
                    <Route path={"/login"} component={Login} />
                  </Route>
                  <Route component={Protected}>
                    <Route component={Default}>
                      <Route
                        path={"/"}
                        component={() => <Navigate href="/subscription" />}
                      />
                      <Route path={"/subscription"} component={Subscription} />
                      <Route path={"/plans"} component={Plans} />
                    </Route>
                    <Route component={Scrollable}>
                      <Route path={"/settings"} component={Settings} />
                      <Route path={"/invoices"} component={Invoices} />
                      <Route path={"/invoices/:id"} component={Invoice} />
                      <Route component={SubscriptionRequired}>
                        <Route path={"/download"} component={Download} />
                      </Route>
                    </Route>
                  </Route>
                  <Route path={"/*"} component={NotFound} />
                </Router>
                <Toaster />
              </VpnSubscriptionProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </LocaleProvider>
      </ColorModeProvider>
    </>
  ),
  root!,
);
