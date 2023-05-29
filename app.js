const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getAllPalyers = `
    SELECT * FROM cricket_team`;
  const allPalyers = await db.all(getAllPalyers);
  response.send(
    allPalyers.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

//post player API

app.post("/players/", async (request, response) => {
  const playerId = request.body;
  const { playerName, jerseyNumber, role } = playerId;
  const addPlayer = `
    INSERT INTO 
    cricket_team (playerName,jerseyNumber,role);
    VALUES (
        '${PlayerName}',
        ${jerseyNumber},
        '${role}'
    );
    `;
  const addPlayerID = await db.run(addPlayer);
  response.send("Player Added to Team");
});

//get palyer API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerIDQuery = `
        SELECT 
         * 
        FROM 
        cricket_team
        WHERE 
        playerId = ${playerId};`;
  const Player = await db.get(getPlayerIDQuery);
  response.send(convertDbObjectToResponseObject(Player));
});

//update the playerId
app.get("/players/:playerId/", async (request, repsonse) => {
  const { PlayerId } = request.params;
  const PlayerDetails = request.body;
  const { playerName, jerseyNumber, role } = PlayerDetails;
  const updatePlayerId = `
        UPDATE 
        cricket_team
        SET 
        playerName = '${playerName}',
        jerseyNumber = '${jerseyNumber}',
        role = '${role}'
        WHERE 
        player_id = ${playerId};`;
  await db.run(updatePlayerId);
  response.send("Player Details Updated");
});
module.exports = app;
