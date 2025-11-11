Formula 1 REST API — COMP 4513 Assignment 1

This project is a Formula 1 REST API built using Node.js, Express, and Supabase. It was built using our lab14b as a skeleton, hence the appearance of "lab14b" here and there.  
It provides multiple endpoints to retrieve F1 data such as races, results, drivers, and constructors.  
The API is hosted on Render, and was developed as part of COMP 4513 – Web Services and Cloud-Based Systems.

---

## Quick Links
[Circuits](https://four513assignment1-iqjw.onrender.com/api/circuits)  
[CircuitsMonza](https://four513assignment1-iqjw.onrender.com/api/circuits/monza)  
[CircuitsCalgary](https://four513assignment1-iqjw.onrender.com/api/circuits/calgary)  
[Constructors](https://four513assignment1-iqjw.onrender.com/api/constructors)  
[ConstructorsFerrary](https://four513assignment1-iqjw.onrender.com/api/constructors/ferrari)  
[Drivers](https://four513assignment1-iqjw.onrender.com/api/drivers)  
[DriversNorris](https://four513assignment1-iqjw.onrender.com/api/drivers/Norris)  
[Driversnorris](https://four513assignment1-iqjw.onrender.com/api/drivers/norris)  
[Driversconnolly](https://four513assignment1-iqjw.onrender.com/api/drivers/connolly)  
[DriversSch](https://four513assignment1-iqjw.onrender.com/api/drivers/search/sch)  
[Driversxxxxx](https://four513assignment1-iqjw.onrender.com/api/drivers/search/xxxxx)  
[DriversbyRace](https://four513assignment1-iqjw.onrender.com/api/drivers/race/1069)  
[Races](https://four513assignment1-iqjw.onrender.com/api/races/1034)  
[RacesSeason](https://four513assignment1-iqjw.onrender.com/api/races/season/20210)  
[RacesSeason](https://four513assignment1-iqjw.onrender.com/api/races/season/1800)  
[RacesSeason](https://four513assignment1-iqjw.onrender.com/api/races/season/2020/5)  
[RacesSeason](https://four513assignment1-iqjw.onrender.com/api/races/season/2020/100)  
[RacesCircuits](https://four513assignment1-iqjw.onrender.com/api/races/circuits/7)  
[RacesSeason&Circuits](https://four513assignment1-iqjw.onrender.com/api/races/circuits/7/season/2015/2022)  
[Races](https://four513assignment1-iqjw.onrender.com/api/races/circuits/7/season/2022/2022)  
[Results](https://four513assignment1-iqjw.onrender.com/api/results/1106)  
[Results](https://four513assignment1-iqjw.onrender.com/api/results/driver/max_verstappen)  
[Results](https://four513assignment1-iqjw.onrender.com/api/results/driver/connolly)  
[Results](https://four513assignment1-iqjw.onrender.com/api/results/drivers/sainz/seasons/2021/2022)  
[Results](https://four513assignment1-iqjw.onrender.com/api/results/drivers/sainz/seasons/2035/2022)  
[Results](https://four513assignment1-iqjw.onrender.com/api/qualifying/1106)  
[Results](https://four513assignment1-iqjw.onrender.com/api/standings/drivers/1120)  
[Results](https://four513assignment1-iqjw.onrender.com/api/standings/constructors/1120)  
[Results](https://four513assignment1-iqjw.onrender.com/api/standings/constructors/asds)  

Live Deployment

Render URL: [Home](https://four513assignment1-iqjw.onrender.com)

--- 

**API Routes and Examples**

## Races
Route: `/f1/races/:start/:end`  
Returns all races between the given start and end years (inclusive).

- Example: [Races 2005–2007](https://four513assignment1-iqjw.onrender.com/api/races/2005/2007)

---

## Drivers
Route: `/f1/drivers/name/:prefix/limit/:num`  
Search for drivers whose surname begins with the specified prefix.

- Example: [Drivers with “sch” prefix, limit 12](https://four513assignment1-iqjw.onrender.com/api/drivers/name/sch/limit/12)

---

## Results
Route: `/f1/results/:race`  
Returns results for a specific race, including driver and constructor information.

- Example: [Results for race ID 700](https://four513assignment1-iqjw.onrender.com/api/results/700)

---

## Status
Route: `/f1/status`  
Lists all race status codes (e.g., Finished, Retired, Accident).

- Example: [Race Status List](https://four513assignment1-iqjw.onrender.com/api/status)

---

## Seasons
Route: `/f1/seasons`  
Returns all available seasons in the dataset.

- Example: [Seasons List](https://four513assignment1-iqjw.onrender.com/api/seasons)

---

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SkyW32/lab14b.git
   cd lab14b
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_KEY=your-anon-or-service-key
   ```

4. **Start the server:**
   ```bash
   node f1-server.js
   ```

5. **Test locally:**  
   Visit [http://localhost:8080/f1/status](http://localhost:8080/api/status)

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Render |
| **Version Control** | Git & GitHub |

---

## Project Structure

```
lab14b/
├── f1-server.js          # Main Express API server
├── f1-tester.js          # Script for testing routes
├── .env                  # Supabase credentials (not tracked in git)
├── .gitignore            # Ignored files/folders
├── package.json          # Node project metadata
├── data/                 # Supporting CSV files
├── scripts/              # Supabase data upload or config scripts
└── css/                  # Styling for vanilla tester (if used)
```

---

## Author

**Author:** Skylar Wiltse  
**Course:** COMP 4513 – Web Services and Cloud-Based Systems  
**Instructor:** Randy Connolly
**Institution:** Mount Royal University  
**Date:** October 20 2025

---

## Other Notes

- This API was built for an assignment as part of COMP 4513.  
- All F1 data is stored and managed in Supabase tables with RLS (Row Level Security) enabled.  
- Environment variables are used to protect database credentials.
