import React from "react";
import ReactDOM from "react-dom";
import NewTabPage from "./components/NewTabPage";
import OptionsPage from "./components/OptionsPage";
import "@fontsource/roboto";
import { CssBaseline } from "@material-ui/core";

const params = new URLSearchParams(window.location.search);
const page = params.get("page");

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    {page === "options" ? <OptionsPage /> : <NewTabPage />}
  </React.StrictMode>,
  document.getElementById("root")
);
