import React from "react";
import ReactDOM from "react-dom";
import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import auth_config from "./auth_config.json";
import { config } from "./overmind";

import "./index.css";

const app = createOvermind(config, {
  devtools: true
});

// A function that routes the user to the right place after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Provider value={app}>
    <Auth0Provider
      domain={auth_config.domain}
      client_id={auth_config.clientId}
      redirect_uri={window.location.origin}
      audience={auth_config.audience}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
