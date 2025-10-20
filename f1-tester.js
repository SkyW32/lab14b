const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supaURL = 'https://filkmxknierpqmkkiebb.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbGtteGtuaWVycHFta2tpZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODc1NDQsImV4cCI6MjA3NTY2MzU0NH0.ly93xYyP5Dl-qS_GRTKVDrtFMjGGfJlojLOSK9H83Ys';

const supabase = createClient(supaURL, supaAnonKey);

app.get('/f1/qualifying/:race', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select(`
            qualifyId, position, q1, q2, q3,
            races (name, year),
            drivers (forename, surname),
            constructors (name)
            `)
            .eq('raceId', req.params.race)
            .order('position', { ascending: true });
    if (error) {
        return res.status(500).json({ error }); 
    }
    res.json(data); 
})

app.get('/f1/races/:start/:end', async (req, res) => {
  const { data, error } = await supabase
    .from('races')
    .select('*')
    .gte('year', req.params.start)
    .lte('year', req.params.end)
    .order('year', { ascending: true });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.get('/f1/drivers/name/:prefix/limit/:num', async (req, res) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .ilike('surname', `${req.params.prefix}%`)
    .order('surname', { ascending: true })
    .limit(parseInt(req.params.num));

  if (error) return res.status(500).json({ error });
  res.json(data);
});

//confirm supabase connectivity
app.get('/test', async (req, res) => {
  const { data, error } = await supabase.from('races').select('raceId, name').limit(3);
  res.json({ data, error });
});


app.listen(8080, () => {
    console.log('Server running on port 8080');
    console.log('Try: /f1/races/2005/2007 or /f1/drivers/name/sch/limit/12');

})