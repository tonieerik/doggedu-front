import React from "react";
import Breadcrumb from "./components/Breadcrumb";
import Category from "./components/Category";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Skill from "./components/Skill";
import { useOvermind } from "./overmind";
import { useAuth0 } from "./react-auth0-spa";
import {
  VIEW_HOME,
  VIEW_CATEGORY,
  VIEW_SKILL,
  VIEW_SETTINGS
} from "./utils/const";

import "./App.css";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { state } = useOvermind();

  if (!isAuthenticated) {
    return (
      <div className="App">
        <button className="login" onClick={() => loginWithRedirect({})}>
          KIRJAUDU SISÄÄN
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <Breadcrumb />
      {state.view === VIEW_CATEGORY && <Category />}
      {state.view === VIEW_HOME && <Home />}
      {state.view === VIEW_SKILL && <Skill />}
      {state.view === VIEW_SETTINGS && <Settings />}
    </div>
  );
}

export default App;
