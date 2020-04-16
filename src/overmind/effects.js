import page from "page";
import {
  addSkillLog,
  getSkillContent,
  getUserData,
  setFavoriteSkill
} from "../utils/api";

export const api = {
  async getContent(user, skillId) {
    return JSON.parse(await getSkillContent(user, skillId));
  },

  async initUser(user) {
    return JSON.parse(await getUserData(user));
  },

  async logSkill(user, dogId, skillId, value, comment) {
    return JSON.parse(await addSkillLog(user, dogId, skillId, value, comment));
  },

  async setFavoriteSkill(user, dogId, skillId, value) {
    return JSON.parse(await setFavoriteSkill(user, dogId, skillId, value));
  }
};

export const router = {
  initialize(routes) {
    Object.keys(routes).forEach(url => {
      page(url, ({ params }) => routes[url](params));
    });
    page.start();
  },
  goTo(url) {
    page.show(url);
  }
};
