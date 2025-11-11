import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config(); // <-- loads the .env file

const app = express();
const PORT = process.env.PORT || 8080;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Shared select strings and helpers
const RACES_SELECT = "raceId, year, round, name, circuits(name, location, country)";
const QUALIFYING_SELECT = `
  qualifyId, position, q1, q2, q3,
  races (name, year),
  drivers (forename, surname),
  constructors (name)
`;

// Handle error messages for less duplication
async function sendQuery(res, builder, { single = false, notFoundMessage, requireNonEmpty = false } = {}) {
  const { data, error } = await builder;
  if (error) return res.status(500).json({ error: error.message });
  if (single) {
    if (!data || !data.length) return res.status(404).json({ message: notFoundMessage || "Not found" });
    return res.json(data[0]);
  }
  if (requireNonEmpty && (!data || data.length === 0)) {
    return res.status(404).json({ message: notFoundMessage || "Not found" });
  }
  return res.json(data);
}

async function getDriverIdByRef(driverRef) {
  const { data, error } = await supabase
    .from("drivers")
    .select("driverId")
    .eq("driverRef", driverRef);
  if (error) return { error };
  const driverId = data && data[0] ? data[0].driverId : null;
  return { driverId };
}

app.get("/", (req, res) => res.json({ message: "F1 API is running!" }));

app.get("/api/circuits", async (req, res) => {
  await sendQuery(res, supabase.from("circuits").select("*"));
});

app.get("/api/circuits/:ref", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("circuits").select("*").eq("circuitRef", req.params.ref),
    { single: true, notFoundMessage: "Circuit not found" }
  );
});

// Constructors
app.get("/api/constructors", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("constructors").select("*").order("name", { ascending: true })
  );
});

app.get("/api/constructors/:ref", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("constructors").select("*").eq("constructorRef", req.params.ref),
    { single: true, notFoundMessage: "Constructor not found" }
  );
});

// Races by season (no limit)
app.get("/api/races/season/:year", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("races")
      .select(RACES_SELECT)
      .eq("year", req.params.year)
      .order("round", { ascending: true })
  );
});

// Races by season with limit
app.get("/api/races/season/:year/:limit", async (req, res) => {
  const limit = parseInt(req.params.limit);
  let query = supabase
    .from("races")
    .select(RACES_SELECT)
    .eq("year", req.params.year)
    .order("round", { ascending: true });

  if (!Number.isNaN(limit) && limit > 0) {
    query = query.limit(limit);
  }

  await sendQuery(res, query);
});

// Races by circuit
app.get("/api/races/circuits/:circuitId", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("races")
      .select(RACES_SELECT)
      .eq("circuitId", req.params.circuitId)
      .order("year", { ascending: true })
      .order("round", { ascending: true })
  );
});

// Races by circuit and year range
app.get("/api/races/circuits/:circuitId/season/:start/:end", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("races")
      .select(RACES_SELECT)
      .eq("circuitId", req.params.circuitId)
      .gte("year", req.params.start)
      .lte("year", req.params.end)
      .order("year", { ascending: true })
      .order("round", { ascending: true })
  );
});

// Single race by id
app.get("/api/races/:raceId", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("races").select(RACES_SELECT).eq("raceId", req.params.raceId),
    { single: true, notFoundMessage: "Race not found" }
  );
});

// Races by year range (generic must come after specific routes)
app.get("/api/races/:start/:end", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("races")
      .select(RACES_SELECT)
      .gte("year", req.params.start)
      .lte("year", req.params.end)
      .order("year", { ascending: true })
      .order("round", { ascending: true })
  );
});

app.get("/api/drivers/name/:prefix/limit/:num", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("drivers")
      .select("*")
      .ilike("surname", `${req.params.prefix}%`)
      .order("surname", { ascending: true })
      .limit(parseInt(req.params.num))
  );
});

// Drivers - list all
app.get("/api/drivers", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("drivers").select("*").order("surname", { ascending: true })
  );
});

// Drivers search by prefix (case-sensitive)
app.get("/api/drivers/search/:prefix", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("drivers")
      .select("*")
      .like("surname", `${req.params.prefix}%`)
      .order("surname", { ascending: true })
  );
});

// Drivers by race participation
app.get("/api/drivers/race/:raceId", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("results")
      .select(`
        positionOrder,
        drivers (driverId, driverRef, code, forename, surname),
        constructors (constructorId, name),
        races (raceId, year, name)
      `)
      .eq("raceId", req.params.raceId)
      .order("positionOrder", { ascending: true })
  );
});

// Driver by exact surname (case-sensitive)
app.get("/api/drivers/:surname", async (req, res) => {
  await sendQuery(
    res,
    supabase.from("drivers").select("*").eq("surname", req.params.surname),
    { single: true, notFoundMessage: "Driver not found" }
  );
});

// end drivers

app.get('/api/results/:race', async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from('results')
      .select(`
        resultId, raceId, positionOrder,
        races (year, name),
        drivers (forename, surname),
        constructors (name)
      `)
      .eq('raceId', req.params.race)
      .order('positionOrder', { ascending: true }),
    { requireNonEmpty: true, notFoundMessage: `No results found for raceId ${req.params.race}` }
  );
});

// Results by driverRef
app.get("/api/results/driver/:driverRef", async (req, res) => {
  const { driverId, error } = await getDriverIdByRef(req.params.driverRef);
  if (error) return res.status(500).json({ error: error.message });
  if (!driverId) return res.status(404).json({ message: "Driver not found" });

  await sendQuery(
    res,
    supabase
      .from("results")
      .select(`
        resultId, raceId, positionOrder, points, grid, laps, statusId,
        races (year, round, name),
        drivers (driverRef, forename, surname),
        constructors (name)
      `)
      .eq("driverId", driverId)
      .order("raceId", { ascending: true })
      .order("positionOrder", { ascending: true })
  );
});

// Results by driverRef and season range
app.get("/api/results/drivers/:driverRef/seasons/:start/:end", async (req, res) => {
  const { driverRef, start, end } = req.params;
  const { driverId, error } = await getDriverIdByRef(driverRef);
  if (error) return res.status(500).json({ error: error.message });
  if (!driverId) return res.status(404).json({ message: "Driver not found" });

  await sendQuery(
    res,
    supabase
      .from("results")
      .select(`
        resultId, raceId, positionOrder, points,
        races (year, round, name),
        drivers (driverRef, forename, surname),
        constructors (name)
      `)
      .eq("driverId", driverId)
      .gte("year", start, { foreignTable: "races" })
      .lte("year", end, { foreignTable: "races" })
      .order("raceId", { ascending: true })
      .order("positionOrder", { ascending: true })
  );
});

// Qualifying by race
app.get('/api/qualifying/:race', async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from('qualifying')
      .select(QUALIFYING_SELECT)
      .eq('raceId', req.params.race)
      .order('position', { ascending: true })
  );
});

// Standings by race - drivers
app.get("/api/standings/drivers/:raceId", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("driverStandings")
      .select(`
        raceId, position, points, wins,
        drivers (forename, surname, driverRef),
        races (year, name)
      `)
      .eq("raceId", req.params.raceId)
      .order("position", { ascending: true })
  );
});

// Standings by race - constructors
app.get("/api/standings/constructors/:raceId", async (req, res) => {
  await sendQuery(
    res,
    supabase
      .from("constructorStandings")
      .select(`
        raceId, position, points, wins,
        constructors (name, constructorRef),
        races (year, name)
      `)
      .eq("raceId", req.params.raceId)
      .order("position", { ascending: true })
  );
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Try: http://localhost:${PORT}/api/circuits`);
});
