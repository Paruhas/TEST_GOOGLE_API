const Decimal = require("../utils/Decimal");
const Location_OBJ = require("../utils/Class/Location_OBJ.js");
const GoogleAPI = require("../utils/Function/GoogleAPI.js");

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
      DESTINATION_POINT
    );
    if (FETCH_google_Directions.isError === true) {
      throw new Error("Error GOOGLE_API at 'Directions API'.");
    }

    // return res.status(999).json({ res_test: FETCH_google_Directions.data });

    // total_distance = FETCH_google_Directions.data.routes[0].legs[0].distance.value
    // first_start_location = FETCH_google_Directions.data.routes[0].legs[0].start_location.lat & long
    // last_end_location = FETCH_google_Directions.data.routes[0].legs[0].end_location.lat & long
    // distance = FETCH_google_Directions.data.routes[0].legs[0].steps[x].distance.value
    // start_location = FETCH_google_Directions.data.routes[0].legs[0].steps[x].start_location.lat & long
    // end_location = FETCH_google_Directions.data.routes[0].legs[0].steps[x].end_location.lat & long
    // maneuver "uturn-XXX" = FETCH_google_Directions.data.routes[0].legs[0].steps[x].maneuver?

    const result = {
      "total_distance(before_cut_uturn)":
        FETCH_google_Directions.data.routes[0].legs[0].distance.value,
      first_start_location: {
        location: {
          latitude:
            FETCH_google_Directions.data.routes[0].legs[0].start_location.lat,
          longitude:
            FETCH_google_Directions.data.routes[0].legs[0].start_location.lng,
        },
      },
      last_end_location: {
        location: {
          latitude:
            FETCH_google_Directions.data.routes[0].legs[0].end_location.lat,
          longitude:
            FETCH_google_Directions.data.routes[0].legs[0].end_location.lng,
        },
      },
      snappedPoints: {},
    };

    const ARR_PATH = []; // { location: {latitude, longitude}}

    const copied_FETCH_google_Directions_steps = JSON.parse(
      JSON.stringify(FETCH_google_Directions.data.routes[0].legs[0].steps)
    );
    // console.log(copied_FETCH_google_Directions_steps);

    /**
     * FOR LOOP;
     */
    for (let x = 0; x < copied_FETCH_google_Directions_steps.length; x++) {
      const data_x = copied_FETCH_google_Directions_steps[x];

      /**
       * IF; current [x] & next [x] maneuver === "uturn-XXX"
       * => SKIP;
       */
      // if (Boolean(data_x.maneuver && data_x.maneuver.search("uturn") !== -1)) {
      if (
        Boolean(
          data_x.maneuver &&
            Decimal.OP(data_x.maneuver.search("uturn"), -1, " !=")
        )
      ) {
        continue;
      }

      if (
        Boolean(
          copied_FETCH_google_Directions_steps[x + 1] &&
            copied_FETCH_google_Directions_steps[x + 1].maneuver &&
            // copied_FETCH_google_Directions_steps[x + 1].maneuver.search(
            //   "uturn"
            // ) !== -1
            Decimal.OP(
              copied_FETCH_google_Directions_steps[x + 1].maneuver.search(
                "uturn"
              ),
              -1,
              "!="
            )
        )
      ) {
        continue;
      }

      /**
       * IF;
       */
      let DISTANCE_EXCEED_300 = false;

      if (
        Boolean(
          data_x.distance &&
            data_x.distance.value &&
            // data_x.distance.value > 300
            Decimal.OP(data_x.distance.value, 300, ">")
        )
      ) {
        // console.log(data_x);

        DISTANCE_EXCEED_300 = true;
        // const FETCH_google_SnapToRoads = await GoogleAPI.getSnapToRoads([
        //   new Location_OBJ(
        //     data_x.start_location.lat,
        //     data_x.start_location.lng
        //   ),
        //   new Location_OBJ(data_x.end_location.lat, data_x.end_location.lng),
        // ]);

        // console.log([
        //   new Location_OBJ(
        //     data_x.start_location.lat,
        //     data_x.start_location.lng
        //   ),
        //   new Location_OBJ(data_x.end_location.lat, data_x.end_location.lng),
        // ]);
        // console.log(
        //   'FETCH_google_SnapToRoads.data.hasOwnProperty("warningMessage")',
        //   FETCH_google_SnapToRoads.data.hasOwnProperty("warningMessage")
        // );

        // if (
        //   FETCH_google_SnapToRoads.isError === false &&
        //   FETCH_google_SnapToRoads.data.hasOwnProperty("warningMessage") ===
        //     true
        // ) {
        // DISTANCE_EXCEED_300 = true;
        // }
      }

      switch (true) {
        case DISTANCE_EXCEED_300 === false:
          // const OBJ_for_ARR_PATH_start = {
          //   location: {
          //     latitude: data_x.start_location.lat,
          //     longitude: data_x.start_location.lng,
          //   },
          // };
          // const OBJ_for_ARR_PATH_end = {
          //   location: {
          //     latitude: data_x.end_location.lat,
          //     longitude: data_x.end_location.lng,
          //   },
          // };

          // ARR_PATH.push(OBJ_for_ARR_PATH_start, OBJ_for_ARR_PATH_end);
          ARR_PATH.push(
            new Location_OBJ(
              data_x.start_location.lat,
              data_x.start_location.lng
            ),
            new Location_OBJ(data_x.end_location.lat, data_x.end_location.lng)
          );
          break;

        case DISTANCE_EXCEED_300 === true:
          const getLatLngBetweenPoint = GoogleAPI.getBetweenPoint(
            data_x.distance.value,
            new Location_OBJ(
              data_x.start_location.lat,
              data_x.start_location.lng
            ),
            new Location_OBJ(data_x.end_location.lat, data_x.end_location.lng)
          );

          if (getLatLngBetweenPoint.isError === true) {
            throw new Error("Error GOOGLE_API at 'getBetweenPoint'");
          }
          console.log(getLatLngBetweenPoint.data);

          getLatLngBetweenPoint.data.forEach((item) => {
            ARR_PATH.push(item);
          });
          break;

        default:
          break;
      }
    }

    const FETCH_google_SnapToRoads = await GoogleAPI.getSnapToRoads(ARR_PATH);
    if (FETCH_google_SnapToRoads.isError === true) {
      throw new Error("Error GOOGLE_API at 'Roads API'.");
    }

    result.snappedPoints = FETCH_google_SnapToRoads.data.snappedPoints;

    return res.status(200).json({
      res_code: "0000",
      res_message: `Request successful.`,
      res_data: result,
    });
  } catch (error) {
    next(error);
  }
};
