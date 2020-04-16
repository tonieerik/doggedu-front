import moment from "moment";

export const formatDate = date => moment(date).format("D.M.YYYY");

export const getFavoriteSkillValue = (state, skillId) => {
  const value = state.favoriteSkills.get(skillId);

  return value || false;
};
