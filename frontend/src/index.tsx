/* @refresh reload */
import "./index.css";
import App from "./pages/App.tsx";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

const root = document.getElementById("root");

render(() => <Router root={App}></Router>, root!);
