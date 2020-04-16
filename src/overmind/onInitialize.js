import { Map, OrderedMap } from "immutable";

export const onInitialize = ({ state, actions, effects }, instance) => {
  instance.reaction(
    ({ user }) => user,
    async user => {
      const userData = await effects.api.initUser(user);

      actions.setDogs(OrderedMap(userData.dogs.map(x => [x.id, x])));
      actions.setFavoriteSkills(
        Map(userData.favoriteSkills.map(x => [x.skill_id, true]))
      ); // TODO: update this when multiple dogs
      actions.setSelectedDog(userData.dogs[0] ? userData.dogs[0].id : null);
      actions.setSkillCategories(
        OrderedMap(userData.skillCategories.map(x => [x.id, x]))
      );
      actions.setSkillLogs(OrderedMap(userData.skillLogs.map(x => [x.id, x]))); // TODO: update this when multiple dogs
      actions.setSkills(OrderedMap(userData.skills.map(x => [x.id, x])));
    },
    { nested: false }
  );

  instance.reaction(
    ({ selectedSkill }) => selectedSkill,
    async selectedSkill => {
      if (!selectedSkill) return;

      const skillContent = await effects.api.getContent(
        state.user,
        selectedSkill
      );
      actions.setSkillContent(skillContent);
    },
    { nested: false }
  );
  /*
    effects.router.initialize({
        '/': () => actions.increaseCount({state}),
    });
*/
};
