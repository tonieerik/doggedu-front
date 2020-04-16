const app = require("express")();
const fs = require("fs");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // TODO: change on production
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://doggedu.eu.auth0.com/.well-known/jwks.json"
  }),
  audience: "https://api.doggedu.com",
  issuer: "https://doggedu.eu.auth0.com/",
  algorithms: ["RS256"]
});

app.use(jwtCheck);

const addSkillLog = async (client, data) => {
  const res = await client.query(
    "INSERT INTO skill_log(skill_id, dog_id, value, comment) VALUES($1, $2, $3, $4) RETURNING *",
    [data.skillId, data.dogId, data.value, data.comment]
  );

  return res.rows[0] || null;
};

const getOwnerId = async (client, ownerEmail) => {
  let ownerResult = await client.query(
    "SELECT id FROM owner WHERE email = '" + ownerEmail + "'"
  );

  if (!ownerResult.rowCount) {
    await client.query("INSERT INTO owner(email) VALUES('" + ownerEmail + "')");
    ownerResult = await client.query(
      "SELECT id FROM owner WHERE email = '" + ownerEmail + "'"
    );
  }

  if (!ownerResult.rowCount) {
    //throw error
    console.error(
      "User not found, and could not be created with email '" +
        ownerEmail +
        "'!"
    );
  }

  return ownerResult.rowCount && ownerResult.rows[0]
    ? ownerResult.rows[0].id
    : null;
};

const getDogs = async (client, ownerId) => {
  const dogsResult = await client.query(
    "SELECT * FROM dog WHERE owner_id = '" + ownerId + "'"
  );

  return dogsResult ? dogsResult.rows : null;
};

const getFavoriteSkills = async (client, dogId) => {
  const result = await client.query(
    "SELECT * FROM favorite_skill WHERE dog_id = '" + dogId + "'"
  );

  return result ? result.rows : null;
};

const getSkillCategories = async client => {
  const result = await client.query("SELECT * FROM skill_category");

  return result ? result.rows : null;
};

const getSkillLogs = async (client, ownerId) => {
  if (!ownerId) return null;

  const result = await client.query(
    "SELECT skill_log.id, skill_log.skill_id, skill_log.dog_id, skill_log.timestamp, skill_log.value, skill_log.comment" +
      ", skill.skill_category_id" +
      " FROM skill_log, dog, skill WHERE skill_log.dog_id = dog.id AND skill.id = skill_log.skill_id AND dog.owner_id = " +
      ownerId +
      " ORDER BY skill_log.timestamp"
  );

  return result ? result.rows : null;
};

const getSkills = async client => {
  const result = await client.query("SELECT * FROM skill");

  return result ? result.rows : null;
};

const removeFavoriteSkill = async (client, dogId, skillId) => {
  const result = await client.query(
    "DELETE FROM favorite_skill WHERE dog_id = $1 AND skill_id = $2",
    [dogId, skillId]
  );

  return result && result.rows ? true : false;
};

const setFavoriteSkill = async (client, dogId, skillId) => {
  const result = await client.query(
    "INSERT INTO favorite_skill VALUES($1, $2)",
    [dogId, skillId]
  );

  return result && result.rows ? true : false;
};

app
  .get("/api/owner/:ownerEmail", async (req, res) => {
    const ownerEmail = req.params ? req.params.ownerEmail : null;

    try {
      const client = await pool.connect();

      const ownerId = await getOwnerId(client, ownerEmail);

      const results = {
        dogs: await getDogs(client, ownerId),
        favoriteSkills: await getFavoriteSkills(client, 1), // TODO: remove hard-coded value
        skillCategories: await getSkillCategories(client),
        skillLogs: await getSkillLogs(client, ownerId),
        skills: await getSkills(client)
      };

      res.json(JSON.stringify(results));
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error: " + err);
    }
  })
  .get("/api/content/:skillId", async (req, res) => {
    const skillId = req.params ? req.params.skillId : null;

    if (!skillId) {
      res.status(400).send(JSON.stringify("Bad request: No skillId given."));
      return;
    }

    let data = "";
    const filepath = __dirname + "/content/" + skillId + ".md";

    if (!fs.existsSync(filepath)) {
      res.status(404).send(JSON.stringify("Error: file not found."));
      return;
    }

    const readStream = fs.createReadStream(filepath, "utf8");

    readStream
      .on("data", function(chunk) {
        data += chunk;
      })
      .on("end", function() {
        res.send(JSON.stringify(data));
      });
  })
  .post("/api/add-log/:skillId", async (req, res) => {
    if (parseInt(req.params.skillId) !== parseInt(req.body.skillId))
      res
        .status(400)
        .send(
          JSON.stringify("Bad request: URL and body skillId does not match")
        );

    const skillLog = req.body || null;

    if (!skillLog)
      res
        .status(400)
        .send(JSON.stringify("Bad request: request body missing or empty"));

    try {
      const client = await pool.connect();
      const result = await addSkillLog(client, skillLog);
      if (result) {
        res.json(result);
      }
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  })
  .post("/api/set-favorite/:dogId/:skillId", async (req, res) => {
    if (parseInt(req.params.dogId) !== parseInt(req.body.dogId))
      res
        .status(400)
        .send(JSON.stringify("Bad request: URL and body dogId does not match"));

    if (parseInt(req.params.skillId) !== parseInt(req.body.skillId))
      res
        .status(400)
        .send(
          JSON.stringify("Bad request: URL and body skillId does not match")
        );

    const client = await pool.connect();

    try {
      await removeFavoriteSkill(client, req.body.dogId, req.body.skillId);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }

    if (req.body.value) {
      try {
        const result = await setFavoriteSkill(
          client,
          req.body.dogId,
          req.body.skillId
        );

        if (result) {
          res.json(result);
        }
      } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      }
    } else {
      res.json(false);
    }

    client.release();
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
