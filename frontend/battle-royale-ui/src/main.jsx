import React from "react";
import ReactDOM from "react-dom/client";

// Supports weights 400-700
import '@fontsource-variable/pixelify-sans';


import App from "./App.jsx";
// import "./index.css";

// const SUBGRAPH_URL = import.meta.env.VITE_SUBGRAPH_URL_PUNKSHIPS;

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: SUBGRAPH_URL,
// });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
      {/* <MetaMaskProvider
        debug={true}
        sdkOptions={{
          dappMetadata: {
            name: "Punkships",
            url: window.location.href,
          },
        }}
      > */}
        <App />
      {/* </MetaMaskProvider> */}
    {/* </ApolloProvider> */}
  </React.StrictMode>
);
