# 🏎️ Formula 1 REST API — COMP 4513 Assignment 1

This project is a Formula 1 REST API built using **Node.js**, **Express**, and **Supabase**.  
It provides multiple endpoints to retrieve F1 data such as races, results, drivers, and constructors.  
The API is hosted on **Render** and was developed as part of **COMP 4513 – Web Services and Cloud-Based Systems**.

---

## 🌐 Live Deployment

🔗 **Render URL:** [https://f1-api-lab14b.onrender.com](https://f1-api-lab14b.onrender.com)

---

## 🚦 API Routes and Examples

### 🏁 Races
**Route:** `/f1/races/:start/:end`  
Returns all races between the given start and end years (inclusive).

- Example: [Races 2005–2007](https://f1-api-lab14b.onrender.com/f1/races/2005/2007)

---

### 🧍 Drivers
**Route:** `/f1/drivers/name/:prefix/limit/:num`  
Search for drivers whose surname begins with the specified prefix.

- Example: [Drivers with “sch” prefix, limit 12](https://f1-api-lab14b.onrender.com/f1/drivers/name/sch/limit/12)

---

### 🏆 Results
**Route:** `/f1/results/:race`  
Returns results for a specific race, including driver and constructor information.

- Example: [Results for race ID 1106](https://f1-api-lab14b.onrender.com/f1/results/1106)

---

### 🧭 Status
**Route:** `/f1/status`  
Lists all race status codes (e.g., Finished, Retired, Accident).

- Example: [Race Status List](https://f1-api-lab14b.onrender.com/f1/status)

---

### 📅 Seasons
**Route:** `/f1/seasons`  
Returns all available seasons in the dataset.

- Example: [Seasons List](https://f1-api-lab14b.onrender.com/f1/seasons)

---

## ⚙️ How to Run Locally

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
   Visit [http://localhost:8080/f1/status](http://localhost:8080/f1/status)

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Render |
| **Version Control** | Git & GitHub |

---

## 📜 Project Structure

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

## 👨‍💻 Author Information

**Author:** Skylar Wiltse  
**Course:** COMP 4513 – Web Services and Cloud-Based Systems  
**Instructor:** Michael Green  
**Institution:** Mount Royal University  
**Date:** October 2025

---

## 🏁 Notes

- This API was built for educational purposes as part of COMP 4513.  
- All F1 data is stored and managed in Supabase tables with RLS (Row Level Security) enabled.  
- Environment variables are used to protect database credentials.
