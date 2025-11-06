// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App'
// import './styles.css'

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter><App /></BrowserRouter>
//   </React.StrictMode>
// )


import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Define your routes (simple example)
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
], {
  future: {
    v7_relativeSplatPath: true, // 👈 enables the new v7 behavior
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
