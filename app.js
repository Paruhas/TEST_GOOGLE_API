require("dotenv").config();
const express = require("express");
const { default: axios } = require("axios");

const googleApiRouter = require("./routes/googleApiRoute");

const app = express();
const PORT = process.env.PORT || 60061;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage
app.get("/", (req, res, next) => {
  try {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>test-google-api</title>
        </head>
        <body></body>
      </html>
      <html lang="en">
        <head>
          <title>test-google-api</title>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        </head>
        <body
          data-new-gr-c-s-check-loaded="14.1042.0"
          data-gr-ext-installed=""
          class="vsc-initialized"
        >
          <div class="info">
            <h1>test-google-api</h1>
            <h2>Welcome to API HomePage</h2>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.use("/google-api", googleApiRouter);

// Error Path
app.use((err, req, res, next) => {
  console.log(err.message);

  return res.status(500).json({
    res_code: "8888",
    res_message: `ERROR. ${err.message}`,
    res_data: {},
  });
});

// Incorrect Path
app.use("*", (req, res, next) => {
  return res
    .status(404)
    .json({ res_code: "9999", res_message: "Path not found.", res_data: {} });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
});

// require("./bin/test.js");
