import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import App from "./App.jsx";
import "./index.css";

const SUBGRAPH_URL = 'https://subgraph.satsuma-prod.com/7a321097545d/jayants-personal--362208/LatestPunkGraph/api';


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: SUBGRAPH_URL,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
