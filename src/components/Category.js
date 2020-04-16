import React from "react";
import { FaChevronRight, FaHeart } from "react-icons/fa";
import Stars from "./Stars";
import { useOvermind } from "../overmind";
import { VIEW_SKILL } from "../utils/const";
import { getFavoriteSkillValue } from "../utils/utils";

const Category = () => {
  const { actions, reaction, state } = useOvermind();

  React.useEffect(() =>
    reaction(
      ({ currentPage }) => currentPage,
      () => {
        document.querySelector("#page").scrollTop = 0;
      }
    )
  );

  const onSkillClick = skill => {
    actions.setSelectedSkill(skill);
    actions.setView(VIEW_SKILL);
  };

  const skills = state.skills
    ? state.skills.filter(x => x.skill_category_id === state.selectedCategory)
    : null;

  const getSkillStars = skillId => {
    const skillLogs = state.skillLogs
      ? state.skillLogs.filter(
          x => x.skill_category_id === state.selectedCategory
        )
      : null;

    const lastSkillLogging = skillLogs.findLast(x => x.skill_id === skillId);

    return lastSkillLogging ? lastSkillLogging.value : 0;
  };

  return (
    <div className="list-container">
      {skills &&
        skills
          .valueSeq()
          .map(skill => (
            <button
              className="skill"
              key={skill.id}
              onClick={() => onSkillClick(skill.id)}
            >
              <span>
                {getFavoriteSkillValue(state, skill.id) ? (
                  <FaHeart className="brown" />
                ) : (
                  <span style={{ display: "inline-block", width: "26px" }} />
                )}
                &nbsp; {skill.name}
              </span>
              <span className="small">
                <Stars value={getSkillStars(skill.id)} />
                &nbsp; &nbsp;
                <FaChevronRight />
              </span>
            </button>
          ))
          .toArray()}
    </div>
  );
};

export default Category;
