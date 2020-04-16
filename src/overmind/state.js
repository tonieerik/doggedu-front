import { VIEWS } from "../utils/const";

const user = {
  email: null,
  token: null
};

export const state = {
  dogs: null,
  favoriteSkills: null,
  selectedCategory: null,
  selectedDog: null,
  selectedSkill: null,
  skillCategories: null,
  skillContent: null,
  skillLogs: null,
  skills: null,
  user,
  view: VIEWS[0]
};
