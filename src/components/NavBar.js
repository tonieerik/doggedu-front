import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../overmind";
import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { state } = useApp();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Link to="/profile">Profile</Link>
          <Link to="/external-api">External API</Link>
          {state.skillCategories &&
            state.skillCategories.map(x => (
              <div key={x.skill_category_id}> {x.name}</div>
            ))}
        </span>
      )}
    </div>
  );
};

export default NavBar;
