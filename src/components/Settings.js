import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { FaTimes } from "react-icons/fa";
import { useAuth0 } from "../react-auth0-spa";
import { useOvermind } from "../overmind";
import { VIEW_HOME } from "../utils/const";

const Settings = () => {
  const { actions, effects, state } = useOvermind();
  const { logout } = useAuth0();

  const onSubmit = async values => {
    const newLog = await effects.api.logSkill(
      state.user,
      state.selectedDog,
      state.selectedSkill,
      values.value,
      values.comment
    );
  };

  return (
    <div className="settings-container">
      <div className="header">
        <h1>Asetukset</h1>
        <button
          className="no-styles"
          onClick={() => actions.setView(VIEW_HOME)}
        >
          <FaTimes />
        </button>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <label>
              asdfa
              <Field component="input" name="value" type="text" value="" />
            </label>
            <button className="submit" type="submit">
              Tallenna
            </button>
            <br />
            <br />
            <button className="logout">Kirjaudu ulos</button>
          </form>
        )}
      />
    </div>
  );
};

export default Settings;
