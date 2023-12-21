let express = require("express");
let axios = require("axios");
let { Client } = require("pg");
let client = new Client({
  host: "localhost",
  user: "postgres",
  password: "Kanda@2127",
  database: "postgres",
  port: "5432",
});

let app = express();

async function insertPlanet(event) {
  let query = `
        INSERT INTO planets (
          name, rotation_period, orbital_period, diameter, climate,
          gravity, terrain, surface_water, created, edited, url
        ) VALUES 
      `;
  for (const planetObject of event) {
    let values = ` ('${planetObject.name}', '${planetObject.rotation_period}', '${planetObject.orbital_period}', '${planetObject.diameter}', '${planetObject.climate}', '${planetObject.gravity}', '${planetObject.terrain}', '${planetObject.surface_water}','${planetObject.created}', '${planetObject.edited}', '${planetObject.url}'),`;
    query = query += values;
  }
  query = query.slice(0, -1);
  try {
    console.log(query);
    await client.query(query);
    return "SUCCESS";
  } catch (err) {
    throw new Error(err);
  }
}

async function update_to_db(callback) {
  let response = await axios.get("http://swapi.dev/api/planets/");
  if (response.data.results.length > 0) {
    let res = await insertPlanet(response.data.results);
    callback(null, res);
  } else {
    console.log("No data to list");
    callback("NO data");
  }
}

client.connect((err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
    update_to_db((err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("data");
      }
    });
  }
});

app.get("/api/planet/list/:id", (req, res) => {});

app.get("/api/planet/search/:id", (req, res) => {});

app.listen("8080", () => {
  console.log("Server Running on port 8080");
});
