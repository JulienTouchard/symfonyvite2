import React from "react";
import { createRoot } from "react-dom/client";
import App from "./component/App";
import Home from "./component/Home";

const appContainer = document.getElementById("app");
if (appContainer) {
  createRoot(appContainer).render(<App />);
}

const homeContainer = document.getElementById("home");
if (homeContainer) {
  let homeProps = {};
  // recuperation des donnees php json en dataset
  const rawProps = homeContainer.dataset.props;
  const route = homeContainer.dataset.route;

  if (rawProps) {
    try {
      homeProps = JSON.parse(rawProps);
    } catch (error) {
      console.error("Props JSON invalide pour Home:", error);
    }
  }

  if (route) {
    homeProps.trucRoute = route;
  }

  // passage de donnees en props pures
  createRoot(homeContainer).render(<Home {...homeProps} />);
}
