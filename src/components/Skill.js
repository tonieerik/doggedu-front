import React, { useState } from "react";
import ReactModal from "react-modal";
import { Form, Field } from "react-final-form";
import MarkdownRenderer from "react-markdown-renderer";
import { FaHeart, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import Stars from "./Stars";
import { useOvermind } from "../overmind";
import { formatDate, getFavoriteSkillValue } from "../utils/utils";

const Skill = () => {
  const { actions, effects, state } = useOvermind();
  const [showModal, setShowModal] = useState(false);

  ReactModal.setAppElement("#root");

  const onSubmit = async values => {
    const newLog = await effects.api.logSkill(
      state.user,
      state.selectedDog,
      state.selectedSkill,
      values.value,
      values.comment
    );

    const skill = state.skills.get(state.selectedSkill);

    actions.addSkillLog({
      ...newLog,
      skill_category_id: skill.skill_category_id
    });

    setShowModal(false);
  };

  const onFavoriteClick = async skillId => {
    const result = await effects.api.setFavoriteSkill(
      state.user,
      state.selectedDog,
      skillId,
      !getFavoriteSkillValue(state, skillId)
    );

    if (result) {
      actions.setFavoriteSkills(state.favoriteSkills.set(skillId, true));
    } else {
      actions.setFavoriteSkills(state.favoriteSkills.delete(skillId));
    }
  };

  const renderModal = () => (
    <ReactModal
      isOpen={showModal}
      contentLabel="Päivitä osaaminen"
      style={{ content: { padding: "0" } }}
    >
      <div className="modal-header">
        <h1>Päivitä osaaminen</h1>
        <button onClick={() => setShowModal(false)}>
          <FaTimes />
        </button>
      </div>
      <div className="modal-content">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <h3>Arviointi:</h3>
              <label>
                <Field component="input" name="value" type="radio" value="0" />
                &nbsp;&nbsp; Ei mainittavaa osaamista
              </label>
              <br />
              <label>
                <Field component="input" name="value" type="radio" value="2" />{" "}
                <Stars value={2} /> Harjoiteltu vain vähän
              </label>
              <br />
              <label>
                <Field component="input" name="value" type="radio" value="4" />{" "}
                <Stars value={4} /> Osaa melko hyvin
              </label>
              <br />
              <label>
                <Field component="input" name="value" type="radio" value="6" />{" "}
                <Stars value={6} /> Osaa todella hyvin
              </label>
              <br />
              <br />
              <h3>Kommentti:</h3>
              <Field component="textarea" name="comment" />
              <button className="submit" type="submit">
                Tallenna
              </button>
            </form>
          )}
        />
      </div>
    </ReactModal>
  );

  const renderFavoriteToggleButton = skill => {
    const favoriteValue = getFavoriteSkillValue(state, skill.id);

    return (
      <div>
        <button
          className={`favorite${favoriteValue ? " gray" : ""}`}
          onClick={() => onFavoriteClick(skill.id, !favoriteValue)}
        >
          {favoriteValue ? (
            <>
              <FaMinus />
              &nbsp;&nbsp;Poista&nbsp;suosikeista
            </>
          ) : (
            <>
              <FaPlus />
              &nbsp;&nbsp;Lisää&nbsp;suosikiksi
            </>
          )}
        </button>
      </div>
    );
  };

  const skill = state.skills.get(state.selectedSkill);
  const skillLogs = state.skillLogs.filter(
    x => x.skill_id === state.selectedSkill
  );
  const lastLog = skillLogs.last();

  if (!skill) return null;

  return (
    <div className="skill-container">
      {renderModal()}
      <div className="skill-header">
        <div>
          <h1>
            {getFavoriteSkillValue(state, skill.id) ? (
              <FaHeart className="brown" />
            ) : null}
            {" " + skill.name}
          </h1>
          {lastLog && (
            <>
              {formatDate(lastLog.timestamp)}
              <Stars value={lastLog.value} />
            </>
          )}
          {renderFavoriteToggleButton(skill)}
        </div>
        <button className="log" onClick={() => setShowModal(true)}>
          Päivitä osaaminen
        </button>
      </div>

      <div className="skill-content">
        <MarkdownRenderer markdown={state.skillContent || ""} />
      </div>

      <div className="skill-log">
        HISTORIA
        <table>
          <tbody>
            {skillLogs
              .reverse()
              .valueSeq()
              .map(x => (
                <tr key={x.id}>
                  <td>{formatDate(x.timestamp)}</td>
                  <td>
                    <Stars value={x.value} />
                  </td>
                  <td>{x.comment}</td>
                </tr>
              ))
              .toArray()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Skill;
