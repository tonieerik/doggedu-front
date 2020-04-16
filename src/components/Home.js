import React from "react";
import { Map } from "immutable";
import Select from "react-select";
import { FaChevronRight, FaCog, FaHeart, FaRegHeart } from "react-icons/fa";
import Stars from "./Stars";
import { useOvermind } from "../overmind";
import { VIEW_CATEGORY, VIEW_SETTINGS } from "../utils/const";

const Home = () => {
  const { actions, state } = useOvermind();

  const onCategoryClick = category => {
    actions.setSelectedCategory(category);
    actions.setView(VIEW_CATEGORY);
  };

  const getCategoryStars = (categoryId = null) => {
    if (!state.skills || !state.skillLogs) return 0;

    const skills = categoryId
      ? state.skills.filter(x => x.skill_category_id === categoryId)
      : state.skills;
    const skillLogs = categoryId
      ? state.skillLogs.filter(x => x.skill_category_id === categoryId)
      : state.skillLogs;

    if (!skills.count()) return 0;

    let filteredSkillLogs = new Map();

    // keep only the last value of the skill
    skillLogs.forEach(x => {
      filteredSkillLogs = filteredSkillLogs.set(x.skill_id, x.value);
    });

    const stars = filteredSkillLogs.reduce((a, b) => a + b) / skills.count();

    return Math.ceil(stars) || 0;
  };

  const renderHeart = categoryId => {
    if (!state.skills) return null;

    const categorySkills = state.skills.filter(
      x => x.skill_category_id === categoryId
    );

    const categorySkillCount = categorySkills.count();
    const favoriteSkillCount = categorySkills.count(x =>
      state.favoriteSkills.get(x.id)
    );

    return favoriteSkillCount ? (
      favoriteSkillCount === categorySkillCount ? (
        <FaHeart className="brown" />
      ) : (
        <FaRegHeart className="brown" />
      )
    ) : (
      <span style={{ display: "inline-block", width: "26px" }}>&nbsp;</span>
    );
  };

  const renderDogSelect = () =>
    state.dogs && (
      <Select
        classNamePrefix="select"
        options={
          state.dogs
            ? state.dogs
                .valueSeq()
                .map(x => ({ value: x.id, label: x.name }))
                .toArray()
            : []
        }
        onChange={x => actions.setSelectedDog(x.value)}
        value={
          state.selectedDog && state.dogs && state.dogs.get(state.selectedDog)
            ? {
                value: state.selectedDog,
                label: state.dogs.get(state.selectedDog).name
              }
            : null
        }
      />
    );

  return (
    <div>
      <div
        className="header"
        style={{
          backgroundImage: "url('../img/myy.jpg')",
          backgroundColor: "#ff0000"
        }}
      >
        <Stars value={getCategoryStars()} />
        <div
          style={{
            alignSelf: "flex-end",
            width: "200px",
            marginBottom: "-20px"
          }}
        >
          {renderDogSelect()}
        </div>
        <button className="cog" onClick={() => actions.setView(VIEW_SETTINGS)}>
          <FaCog />
        </button>
      </div>
      <div className="list-container">
        {state.skillCategories &&
          state.skillCategories
            .valueSeq()
            .map(category => (
              <button
                className="category"
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
              >
                <span>
                  {renderHeart(category.id)} &nbsp; {category.name}
                </span>
                <span className="small">
                  <Stars value={getCategoryStars(category.id)} />
                  &nbsp; &nbsp;
                  <FaChevronRight />
                </span>
              </button>
            ))
            .toArray()}
      </div>
    </div>
  );
};

export default Home;
