const axios = require("axios");
const DecimalJS = require("decimal.js");
require("dotenv").config();

const Decimal = {
  changeInput: (input) => (new DecimalJS(input).isNaN() ? 0 : input),
  plus: (input1, input2) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    let res = new DecimalJS(input1).plus(input2).toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  minus: (input1, input2) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    let res = new DecimalJS(input1).minus(input2).toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  mul: (input1, input2) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    let res = new DecimalJS(input1).mul(input2).toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  div: (input1, input2) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    let res = new DecimalJS(input1).div(input2).toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  abs: (input1) => {
    input1 = Decimal.changeInput(input1 || 0);

    let res = new DecimalJS(input1).absoluteValue().toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  /**
   *
   * @param {*} input1 number
   * @param {*} input2 allow decimal (gte 0) / digit (lt 0)
   * @returns
   */
  roundDownNumber: (input1, input2) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    if (new DecimalJS(input2).lessThan(0)) {
      const input2_absValue = new DecimalJS(input2).absoluteValue();

      const digit = new DecimalJS(10).toPower(input2_absValue);

      return new DecimalJS(
        new DecimalJS(new DecimalJS(input1).toFixed(0, DecimalJS.ROUND_DOWN))
          .dividedBy(digit)
          .toFixed(0, DecimalJS.ROUND_DOWN)
      ).mul(digit);
    } else {
      // return new DecimalJS(input1).toFixed(input2, DecimalJS.ROUND_DOWN);

      const decimalsPow = new DecimalJS(10).toPower(input2);

      return new DecimalJS(
        new DecimalJS(new DecimalJS(input1).mul(decimalsPow)).floor()
      ).dividedBy(decimalsPow);
    }
  },
  /**
   *
   * @param {*} input1 number
   * @param {*} input2 number
   * @param {string} input3 string of operator
   * @returns
   */ OP: (input1, input2, input3) => {
    input1 = Decimal.changeInput(input1 || 0);
    input2 = Decimal.changeInput(input2 || 0);

    let res = false;

    switch (input3) {
      case ">":
        res = new DecimalJS(input1).greaterThan(input2);

        break;

      case ">=":
        res = new DecimalJS(input1).greaterThanOrEqualTo(input2);

        break;

      case "<":
        res = new DecimalJS(input1).lessThan(input2);

        break;

      case "<=":
        res = new DecimalJS(input1).lessThanOrEqualTo(input2);

        break;

      case "=":
        res = new DecimalJS(input1).equals(input2);

        break;

      case "!=":
        res = new DecimalJS(input1).equals(input2);
        res = !res;

        break;

      default:
        break;
    }

    return res;
  },
  getAllowDecimal: (input1) => {
    input1 = Decimal.changeInput(input1 || 0);

    let res = 0;

    const input1_precision = new DecimalJS(input1).precision(true);

    switch (true) {
      case new DecimalJS(input1_precision).greaterThan(1):
        res = new DecimalJS(new DecimalJS(input1_precision).minus(1)).negated();
        break;

      default:
        res = new DecimalJS(input1).decimalPlaces();
        break;
    }

    return res;
  },
  roundNumber: (input1) => {
    let res = new DecimalJS(input1).round().toFixed();

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
  roundNumber_decimal: (input1, input2) => {
    let res = new DecimalJS(input1).toFixed(input2);

    const res_decimalPlaces = new DecimalJS(res).decimalPlaces();

    if (new DecimalJS(res_decimalPlaces).greaterThan(8)) {
      res = new DecimalJS(res).toFixed(8, DecimalJS.ROUND_DOWN);
    }

    return res;
  },
};

class Location_OBJ {
  constructor(latitude, longitude) {
    this.location = {
      latitude: latitude,
      longitude: longitude,
    };
  }
}

const Validator = {
  isOject: (input1) => {
    return Boolean(
      input1 &&
        input1.toString() === "[object Object]" &&
        !Array.isArray(input1) &&
        input1 instanceof Object
    );
  },

  isArray: (input1) => {
    return Boolean(input1 && input1 instanceof Array && Array.isArray(input1));
  },
};

const Polyline = {
  decode: (polyline) => {
    let _ = {};

    _.Ya = function (a, b, c) {
      null != b && (a = Math.max(a, b));
      null != c && (a = Math.min(a, c));
      return a;
    };
    _.Za = function (a, b, c) {
      c -= b;
      return ((((a - b) % c) + c) % c) + b;
    };
    _.w = function (a) {
      return a ? a.length : 0;
    };

    _.E = function (a, b, c) {
      a -= 0;
      b -= 0;
      c || ((a = _.Ya(a, -90, 90)), 180 != b && (b = _.Za(b, -180, 180)));
      this.lat = function () {
        return a;
      };
      this.lng = function () {
        return b;
      };
    };

    function decodePath(a) {
      for (
        var b = _.w(a),
          c = Array(Math.floor(a.length / 2)),
          d = 0,
          e = 0,
          f = 0,
          g = 0;
        d < b;
        ++g
      ) {
        var h = 1,
          l = 0,
          n;
        do (n = a.charCodeAt(d++) - 63 - 1), (h += n << l), (l += 5);
        while (31 <= n);
        e += h & 1 ? ~(h >> 1) : h >> 1;
        h = 1;
        l = 0;
        do (n = a.charCodeAt(d++) - 63 - 1), (h += n << l), (l += 5);
        while (31 <= n);
        f += h & 1 ? ~(h >> 1) : h >> 1;
        c[g] = new _.E(1e-5 * e, 1e-5 * f, !0);
      }
      c.length = g;
      return c;
    }

    const result = decodePath(polyline).map(function (el) {
      return {
        latitude: Number(el.lat().toFixed(5)),
        longitude: Number(el.lng().toFixed(5)),
      };
    });

    return result;
  },
  clean: (input1) => {
    const res = [];

    try {
      let arr = { latitude: "", longitude: "" };

      for (let x = 0; x < input1.length; x++) {
        const data_x = input1[x];

        if (x === 0) {
          arr.latitude = data_x.latitude;
          arr.longitude = data_x.longitude;

          res.push({
            location: {
              latitude: data_x.latitude,
              longitude: data_x.longitude,
            },
          });

          continue;
        }

        if (
          arr.latitude !== data_x.latitude &&
          arr.longitude !== data_x.longitude
        ) {
          arr.latitude = data_x.latitude;
          arr.longitude = data_x.longitude;

          res.push({
            location: {
              latitude: data_x.latitude,
              longitude: data_x.longitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return res;
  },
};

const GoogleAPI = {
  getDirections: async (
    STARTING_POINT,
    DESTINATION_POINT,
    ALTERNATIVES,
    AVOID,
    MODE
  ) => {
    const res = {
      isError: false,
      data: null,
    };

    try {
      /**
       * SWITCH; input parameter (obj)
       */
      switch (true) {
        case !STARTING_POINT:
          throw new Error("STARTING_POINT is require.");
          break;

        case STARTING_POINT && !Validator.isOject(STARTING_POINT):
          throw new Error("STARTING_POINT must be Object.");
          break;

        case !STARTING_POINT.hasOwnProperty("latitude") &&
          !STARTING_POINT.hasOwnProperty("longitude"):
          throw new Error(
            "STARTING_POINT Object require property 'latitude' and 'longitude'."
          );
          break;

        case !DESTINATION_POINT:
          throw new Error("DESTINATION_POINT is require.");
          break;

        case DESTINATION_POINT && !Validator.isOject(DESTINATION_POINT):
          throw new Error("DESTINATION_POINT must be Object.");
          break;

        case !DESTINATION_POINT.hasOwnProperty("latitude") &&
          !DESTINATION_POINT.hasOwnProperty("longitude"):
          throw new Error(
            "DESTINATION_POINT Object require property 'latitude' and 'longitude'."
          );
          break;

        default:
          break;
      }

      let alternatives = ALTERNATIVES || false; // false for get only 1 path
      let avoid = AVOID || ""; // "tolls|highways|ferries|indoor";
      let mode = MODE || "driving "; // "driving";

      const PARAMETER = `?origin=${STARTING_POINT.latitude},${STARTING_POINT.longitude}&destination=${DESTINATION_POINT.latitude},${DESTINATION_POINT.longitude}&alternatives=${alternatives}&avoid=${avoid}&mode=${mode}&key=${process.env.GOOGLE_API_KEY}`;

      const configs = {
        method: "get",
        url: `${process.env.GOOGLE_API_MAPS_URL}/directions/json${PARAMETER}`,
        headers: {},
      };
      console.log({ "URL_GoogleAPI.getDirections": configs.url });

      const FETCH = await axios(configs);

      if (FETCH.data.status !== "OK") {
        throw new Error(FETCH.data.status);
      }

      res.isError = false;
      res.data = FETCH.data;
      res.url = configs.url;
    } catch (error) {
      console.log("ERROR GoogleAPI.getDirections", error.message);

      res.isError = true;
      res.data = error.message || null;
    }

    return res;
  },
  getShortestRoutes_fromGoogleDirections: (arr) => {
    try {
      let shortest = arr[0];

      for (let i = 1; i < arr.length; i++) {
        if (arr[i].legs[0].distance.value < shortest.legs[0].distance.value) {
          shortest = arr[i];
        }
      }

      return { isError: false, data: shortest };
    } catch (error) {
      console.log(error.message);

      return { isError: true, data: error.message || null };
    }
  },
  decodeMAPS: (arr_steps) => {
    const res = {
      isError: false,
      data: null,
    };
    const arr_res = [];
    let arr_separate = [];

    try {
      for (let x = 0; x < arr_steps.length; x++) {
        const data_x = arr_steps[x];

        if (
          data_x.maneuver &&
          Decimal.OP(data_x.maneuver.search("uturn"), -1, "!=")
        ) {
          if (arr_separate.length !== 0) {
            arr_res.push(arr_separate);

            arr_separate = [];
          }

          continue;
        }

        if (Decimal.OP(data_x.distance.value, 300, ">")) {
          if (arr_separate.length !== 0) {
            arr_res.push(arr_separate);

            arr_separate = [];
          }

          const res_Polyline_decode = Polyline.decode(data_x.polyline.points);
          const res_Polyline_clean = Polyline.clean(res_Polyline_decode);

          res_Polyline_clean.forEach((item) => {
            item.maneuver = data_x.maneuver || null;
          });

          res_Polyline_clean.unshift("POLYLINE");

          arr_res.push(res_Polyline_clean);

          continue;
        }

        const start = new Location_OBJ(
          data_x.start_location.lat,
          data_x.start_location.lng
        );
        const end = new Location_OBJ(
          data_x.end_location.lat,
          data_x.end_location.lng
        );
        start.maneuver = data_x.maneuver || null;
        end.maneuver = data_x.maneuver || null;

        arr_separate.push(start, end);

        if (Decimal.OP(x, arr_steps.length - 1, "=")) {
          if (arr_separate.length !== 0) {
            arr_res.push(arr_separate);
          }
        }
      }

      res.isError = false;
      res.data = arr_res;
    } catch (error) {
      console.log(error.message);

      res.isError = true;
      res.data = error.message || null;
    }

    return res;
  },
  getSnapToRoads_V2: async (arr3d) => {
    try {
      let res = undefined;

      if (arr3d[0] !== "POLYLINE") {
        let interpolate = true;
        let path = "";

        for (let x = 0; x < arr3d.length; x++) {
          const data_x = arr3d[x].location;

          path =
            path +
            (Decimal.OP(path.length, 0, "=") ? "" : "|") +
            data_x.latitude +
            "," +
            data_x.longitude;
        }

        const PARAMETER = `?interpolate=${interpolate}&path=${path}&key=${process.env.GOOGLE_API_KEY}`;

        const configs = {
          method: "get",
          url: `${process.env.GOOGLE_API_ROADS_URL}/snapToRoads${PARAMETER}`,
          headers: {},
        };
        // console.log({ "URL_GoogleAPI.getSnapToRoads_V2": configs.url });

        const FETCH = await axios(configs);

        if (FETCH.data.hasOwnProperty("error")) {
          throw new Error(FETCH.data.error.status);
        }

        res = FETCH.data.snappedPoints;

        let OBJ_last_LatLng = {
          lat: "",
          lng: "",
        };
        res = res.filter((item) => {
          if (
            OBJ_last_LatLng.lat === item.location.latitude &&
            OBJ_last_LatLng.lng === item.location.longitude
          ) {
            OBJ_last_LatLng.lat = item.location.latitude;
            OBJ_last_LatLng.lng = item.location.longitude;

            return;
          }

          OBJ_last_LatLng.lat = item.location.latitude;
          OBJ_last_LatLng.lng = item.location.longitude;

          item.maneuver = arr3d[0].maneuver;

          return item;
        });
      }

      if (arr3d[0] === "POLYLINE") {
        arr3d.shift();

        res = arr3d;
      }

      return res;
    } catch (error) {
      console.log(error);

      return null;
    }
  },
};

const getFullPath = async (body) => {
  try {
    const { STARTING_POINT, DESTINATION_POINT } = body;

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

    // const ARR3D_PATH = [];

    // const ARR_PATH = []; // { location: {latitude, longitude}}

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
    // console.log(res_promiseAll_getSnapToRoads_V2);
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

    return result;
  } catch (error) {
    console.log(error);

    return null;
  }
};

getFullPath({
  STARTING_POINT: {
    latitude: 13.802525935264486,
    longitude: 100.57177798393938,
  },
  DESTINATION_POINT: {
    latitude: 13.75908730706716,
    longitude: 100.56542441041432,
  },
}).then((data) => console.log(data));
