exports.encode = (arr3d, options_precision) => {
  const defaultOptions_precision = function (options) {
    if (typeof options === "number") {
      // Legacy
      options = {
        precision: options,
      };
    } else {
      options = options || {};
    }

    options.precision = options.precision || 5;
    options.factor = options.factor || Math.pow(10, options.precision);
    options.dimension = options.dimension || 2;

    return options;
  };

  options_precision;
};

exports.decode = (polyline) => {
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
};

exports.clean = (input1) => {
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
};
