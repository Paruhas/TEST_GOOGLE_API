const Decimal = require("../utils/Decimal");
const Location_OBJ = require("../utils/Class/Location_OBJ.js");
const GoogleAPI = require("../utils/Function/GoogleAPI.js");
const Polyline = require("../utils/Function/Polyline");

exports.getRoadsApi_snapToRoads = async (req, res, next) => {
  try {
    const { PATH } = req.body;

    const FETCH_google_SnapToRoads = await GoogleAPI.getSnapToRoads(PATH);

    return res.status(200).json({
      res_code: "0000",
      res_message: `Request successful.`,
      res_data: FETCH_google_SnapToRoads,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMapsApi_directions = async (req, res, next) => {
  try {
    const { STARTING_POINT, DESTINATION_POINT } = req.body;

    const FETCH_google_Directions = await GoogleAPI.getDirections(
      STARTING_POINT,
      DESTINATION_POINT
    );

    return res.status(200).json({
      res_code: "0000",
      res_message: `Request successful.`,
      res_data: FETCH_google_Directions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFullPath = async (req, res, next) => {
  try {
    const { STARTING_POINT, DESTINATION_POINT } = req.body;

    const FETCH_google_Directions = await GoogleAPI.getDirections(
      STARTING_POINT,
      DESTINATION_POINT,
      true,
      "indoor",
      "driving"
    );
    if (FETCH_google_Directions.isError === true) {
      throw new Error("Error GOOGLE_API at 'Directions API'.");
    }
    const FETCH_shortestRoutes =
      GoogleAPI.getShortestRoutes_fromGoogleDirections(
        FETCH_google_Directions.data.routes
      );
    if (FETCH_shortestRoutes.isError === true) {
      throw new Error("Error GOOGLE_API at 'Shortest Routes'.");
    }

    FETCH_google_Directions.data.routes = [];
    FETCH_google_Directions.data.routes.push(FETCH_shortestRoutes.data);

    const result = {
      "total_distance(only road and before cut uturn)":
        FETCH_google_Directions.data.routes[0].legs[0].distance.value,
      client_start_location: new Location_OBJ(
        STARTING_POINT.latitude,
        STARTING_POINT.longitude
      ),
      client_end_location: new Location_OBJ(
        DESTINATION_POINT.latitude,
        DESTINATION_POINT.longitude
      ),
      roads_start_location: new Location_OBJ(
        FETCH_google_Directions.data.routes[0].legs[0].start_location.lat,
        FETCH_google_Directions.data.routes[0].legs[0].start_location.lng
      ),
      roads_end_location: new Location_OBJ(
        FETCH_google_Directions.data.routes[0].legs[0].end_location.lat,
        FETCH_google_Directions.data.routes[0].legs[0].end_location.lng
      ),
      snappedPoints: [],
    };

    const copied_FETCH_google_Directions_steps = JSON.parse(
      JSON.stringify(FETCH_google_Directions.data.routes[0].legs[0].steps)
    );
    // console.log(copied_FETCH_google_Directions_steps);

    const FETCH_decodeMAPS = GoogleAPI.decodeMAPS(
      copied_FETCH_google_Directions_steps
    );
    if (FETCH_decodeMAPS.isError === true) {
      throw new Error("Error GOOGLE_API at 'Decode MAPS'.");
    }

    const ARR3D_PATH = JSON.parse(JSON.stringify(FETCH_decodeMAPS.data));

    const promiseAll_getSnapToRoads_V2 = [];

    for (let x = 0; x < ARR3D_PATH.length; x++) {
      const data_x = ARR3D_PATH[x];

      promiseAll_getSnapToRoads_V2.push(GoogleAPI.getSnapToRoads_V2(data_x));
    }

    const res_promiseAll_getSnapToRoads_V2 = await Promise.all(
      promiseAll_getSnapToRoads_V2
    );
    if (res_promiseAll_getSnapToRoads_V2.includes(null)) {
      throw new Error("Error GOOGLE_API at 'SnapToRoads_V2'.");
    }

    for (let x = 0; x < res_promiseAll_getSnapToRoads_V2.length; x++) {
      const data_x = res_promiseAll_getSnapToRoads_V2[x];

      data_x.forEach((item) => result.snappedPoints.push(item));
    }

    if (
      Decimal.OP(
        Decimal.roundNumber_decimal(
          result.snappedPoints[0].location.latitude,
          7
        ),
        result.client_start_location.location.latitude,
        "!="
      ) ||
      Decimal.OP(
        Decimal.roundNumber_decimal(
          result.snappedPoints[0].location.longitude,
          7
        ),
        result.client_start_location.location.longitude,
        "!="
      )
    ) {
      const start = result.client_start_location;
      start.maneuver = null;

      result.snappedPoints.unshift(start);
    }

    if (
      Decimal.OP(
        Decimal.roundNumber_decimal(
          result.snappedPoints[result.snappedPoints.length - 1].location
            .latitude,
          7
        ),
        result.client_end_location.location.latitude,
        "!="
      ) ||
      Decimal.OP(
        Decimal.roundNumber_decimal(
          result.snappedPoints[result.snappedPoints.length - 1].location
            .longitude,
          7
        ),
        result.client_end_location.location.longitude,
        "!="
      )
    ) {
      const end = result.client_end_location;
      end.maneuver = null;

      result.snappedPoints.push(end);
    }

    return res.status(200).json({
      res_code: "0000",
      res_message: `Request successful.`,
      res_data: {
        MAP_API: FETCH_google_Directions.data,
        ARR3D_PATH,
        res_promiseAll_getSnapToRoads_V2,
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};
