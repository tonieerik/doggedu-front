export const addSkillLog = async (user, dogId, skillId, value, comment) => {
  try {
    const response = await fetch(`/api/add-log/${skillId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        dogId,
        skillId,
        value: parseInt(value),
        comment
      })
    });

    const responseData = await response.text();

    return responseData;
  } catch (error) {
    console.error(error);
  }
};

export const getSkillContent = async (user, skillId) => {
  try {
    const response = await fetch(`/api/content/${skillId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const responseData = await response.text();

    return responseData;
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async user => {
  try {
    const response = await fetch(
      `/api/owner/${encodeURIComponent(user.email)}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error(error);
  }
};

export const setFavoriteSkill = async (user, dogId, skillId, value) => {
  try {
    const response = await fetch(`/api/set-favorite/${dogId}/${skillId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        dogId,
        skillId,
        value
      })
    });

    const responseData = await response.text();

    return responseData;
  } catch (error) {
    console.error(error);
  }
};
