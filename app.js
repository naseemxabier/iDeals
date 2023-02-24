require("dotenv").config();

require("./db");

const express = require("express");

const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials")

const app = express();

require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "new-app";


app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);  

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const dealsRoutes = require("./routes/deal.routes");
app.use("/deals", dealsRoutes)

const adminRoutes = require("./routes/admin.routes");
app.use("/admin", adminRoutes);

require("./error-handling")(app);

module.exports = app;
