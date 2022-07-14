require("dotenv").config();
const express = require("express");

const { logger: logMiddleware } = require("./middleware/log.js");
const homeMiddleware = require("./middleware/home.js");
const versionCheck = require("./middleware/version_check.js");
const errorMiddleware = require("./middleware/error.js");
const pathErrorMiddleware = require("./middleware/path_error.js");
const googleApiRouter = require("./routes/googleApiRoute");

const app = express();
const PORT = process.env.PORT || 60061;
const SERVER = process.env.SERVER || 60061;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logMiddleware);

// Homepage
app.get("/", homeMiddleware);
app.get("/api/version/001", versionCheck);

app.use("/google-api", googleApiRouter);

// Error Path
app.use(errorMiddleware);

// Incorrect Path
app.use("*", pathErrorMiddleware);

app.listen(PORT, async () => {
  console.log(
    `
  =====================================

    Server is running on port: ${PORT}
    Currently running server: ${SERVER}

  =====================================
`
  );
});

// require("./bin/test.js");
