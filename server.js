import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 8080;

const supabase = createClient(
  "https://filkmxknierpqmkkiebb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbGtteGtuaWVycHFta2tpZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODc1NDQsImV4cCI6MjA3NTY2MzU0NH0.ly93xYyP5Dl-qS_GRTKVDrtFMjGGfJlojLOSK9H83Ys"
);

app.get("/", (req, res) => res.json({ message: "F1 API is running!" }));

app.get("/api/circuits", async (req, res) => {
  const { data, error } = await supabase.from("circuits").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/circuits/:ref", async (req, res) => {
  const { data, error } = await supabase
    .from("circuits")
    .select("*")
    .eq("circuitRef", req.params.ref);

  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ message: "Circuit not found" });
  res.json(data[0]);
});

app.get("/api/races/:start/:end", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select("raceId, year, round, name, circuits(name, location, country)")
    .gte("year", req.params.start)
    .lte("year", req.params.end)
    .order("year", { ascending: true })
    .order("round", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/api/drivers/name/:prefix/limit/:num", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .ilike("surname", `${req.params.prefix}%`)
    .order("surname", { ascending: true })
    .limit(parseInt(req.params.num));

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/results/:race', async (req, res) => {
  const { data, error } = await supabase
    .from('results')
    .select(`
      resultId, raceId, positionOrder,
      races (year, name),
      drivers (forename, surname),
      constructors (name)
    `)
    .eq('raceId', req.params.race)
    .order('positionOrder', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res.status(404).json({
      message: `No results found for raceId ${req.params.race}`,
    });
  }

  res.json(data);
});


app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Try: http://localhost:${PORT}/api/circuits`);
});
