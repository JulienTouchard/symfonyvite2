import React from "react";
import { createRoot } from "react-dom/client";
import App from "./component/App";
import Home from "./component/Home";
//point d'entrée pour App.jsx
createRoot(document.getElementById("app")).render(<App></App>);
//point d'entré pour Home.jsx
createRoot(document.getElementById("home")).render(<Home></Home>);