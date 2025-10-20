// Create express app
const express = require("express");
const app = express();
app.use(express.json());

const provider = require("./scripts/painting-provider.js");

//Root endpoint, all paintings
app.get("/", (req, res) => {
  provider.retrievePaintings(req, res);
});

//Single painting endpoint
app.get("/:id", (req, res) => {
  provider.retrieveSinglePainting(req, res);
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});

let port = 8080;
app.listen(port, () => {
  console.log("Server running at port= " + port);
});
