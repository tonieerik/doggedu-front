export const addSkillLog = ({ state }, skillLog) => {
  state.skillLogs = state.skillLogs.set(skillLog.id, skillLog);
};

export const setDogs = ({ state }, dogs) => {
  state.dogs = dogs;
};

export const setFavoriteSkills = ({ state }, favoriteSkills) => {
  state.favoriteSkills = favoriteSkills;
};

export const setSelectedCategory = ({ state }, category) => {
  state.selectedCategory = category;
};

export const setSelectedDog = ({ state }, dog) => {
  state.selectedDog = dog;
};

export const setSelectedSkill = ({ state }, skill) => {
  state.selectedSkill = skill;
};

export const setSkillCategories = ({ state }, skillCategories) => {
  state.skillCategories = skillCategories;
};

export const setSkillContent = ({ state }, skillContent) => {
  state.skillContent = skillContent;
};

export const setSkillLogs = ({ state }, skillLogs) => {
  state.skillLogs = skillLogs;
};

export const setSkills = ({ state }, skills) => {
  state.skills = skills;
};

export const setUser = ({ state }, { user, token }) => {
  state.user = {
    email: user.email,
    token
  };
};

export const setView = ({ state }, view) => {
  state.view = view;
};
