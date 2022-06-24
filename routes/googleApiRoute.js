const express = require("express");
const googleApiRouter = express.Router();
const googleApiController = require("../controllers/googleApiController");

googleApiRouter.post("/road", googleApiController.getRoadsApi_snapToRoads);
googleApiRouter.post("/map", googleApiController.getMapsApi_directions);
googleApiRouter.post("/full-path", googleApiController.getFullPath);

module.exports = googleApiRouter;
