const express = require("express");
const app = express();
const configureRouter = require("./routes");
const cors = require("cors");

//Set up express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));

//Middlewares for analytics
app.use(async (req, res, next) => {
  const ts = new Date().toLocaleString();
  const method = req.method;
  const endpoint = req.url;
  console.log(`${ts} | ${method} : ${endpoint}`);

  next();
});

//Configure router
configureRouter(app);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  const ts = new Date().toLocaleString();
  console.log(`${ts} | Server listening on http://localhost:${PORT}`);
});
