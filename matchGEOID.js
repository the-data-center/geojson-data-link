const fs = require('fs');
const turfBooleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
const resolve = require('path').resolve;


const doMatch = function(options, pointGeoJSON, polyGeoJSON) {
  var fields = options.fields || ["GEOID"];
  var points = pointGeoJSON.features;
  var polies = polyGeoJSON.features;
  points.forEach(function(point) {
    polies.forEach(function(poly) {
      let isIn = turfBooleanPointInPolygon(point, poly);
      if (isIn) {
        if (typeof fields === "string") {
          fields = [fields];
        }
        fields.forEach(function(fname) {
          if (options.reverse) {
            if (poly.properties[fname]) {
              poly.properties[fname] += ',' + point.properties[fname];
            } else {
              poly.properties[fname] = point.properties[fname];
            }
          } else {
            if (point.properties[fname]) {
              point.properties[fname] += ',' + poly.properties[fname];
            } else {
              point.properties[fname] = poly.properties[fname];
            }
          }
        })
      }

    })
  })
  return options.reverse?polyGeoJSON:pointGeoJSON;
}
//synchronous version (default on CLI)
function matchGEOIDSync(options, callback) {
  var polyfile = resolve(options.polyfile);
  var pointfile = resolve(options.coordinatesfile);

  var polyGeoJSON = JSON.parse(fs.readFileSync(polyfile, {
    encoding: 'utf-8'
  }))
  var pointGeoJSON = JSON.parse(fs.readFileSync(pointfile, {
    encoding: 'utf-8'
  }));

  var newFile = doMatch(options,pointGeoJSON,polyGeoJSON);

  if (typeof callback === "function") {
    callback(null, newFile);
  } else {
    if (require.main == module) {
      //stdout
      console.log(JSON.stringify(newFile))
    } else {
      //return
      return newFile;
    }
  }
}

//async version for not blocking io (default when used as a library)
function matchGEOIDAsync(options, callback) {
  var polyfile = resolve(options.polyfile);
  var pointfile = resolve(options.coordinatesfile);
  fs.readFile(polyfile, {
    encoding: 'utf-8'
  }, function(err, file) {
    var polyGeoJSON = JSON.parse(file);
    fs.readFile(pointfile, {
      encoding: 'utf-8'
    }, function(err, file) {
      var pointGeoJSON = JSON.parse(file)
      var newFile = doMatch(options,pointGeoJSON,polyGeoJSON);
      if (!err.length) err = null;
      if (typeof callback === "undefined") {
        callback(err, newFile);
      }
    })
  })
}

function matchGEOID(options, callback) {
  if (options.sync) {
    return matchGEOIDSync(options, callback)
  } else {
    return matchGEOIDAsync(options, callback)
  }
}

module.exports.matchGEOID = matchGEOID;
