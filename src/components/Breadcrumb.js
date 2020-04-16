import React from "react";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { useOvermind } from "../overmind";
import { VIEW_HOME, VIEW_CATEGORY, VIEW_SKILL } from "../utils/const";

export default () => {
  const { state, actions } = useOvermind();

  const onHome = () => {
    actions.setSelectedCategory(null);
    actions.setSelectedSkill(null);
    actions.setView(VIEW_HOME);
  };

  const onCategory = () => {
    actions.setSelectedSkill(null);
    actions.setView(VIEW_CATEGORY);
  };

  if (state.view !== VIEW_CATEGORY && state.view !== VIEW_SKILL) return null;

  return (
    <div className="breadcrumb">
      <button className="breadcrumb no-styles" onClick={() => onHome()}>
        {state.selectedDog &&
          state.dogs &&
          state.dogs.get(state.selectedDog) &&
          state.dogs.get(state.selectedDog).name}
      </button>
      <FaChevronRight className="small" />
      <button className="breadcrumb no-styles" onClick={() => onCategory()}>
        {state.selectedCategory &&
          state.skillCategories.get(state.selectedCategory) &&
          state.skillCategories.get(state.selectedCategory).name}
      </button>
      {state.view === VIEW_SKILL && (
        <>
          {" "}
          <FaChevronRight className="small" />{" "}
          {state.selectedSkill &&
            state.skills.get(state.selectedSkill) &&
            state.skills.get(state.selectedSkill).name}
        </>
      )}
    </div>
  );
};
