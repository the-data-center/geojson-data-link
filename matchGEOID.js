const fs = require('fs');
const turf = require('@turf/helpers');
const turfBooleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;
const turfCentroid = require('@turf/centroid').default;
const resolve = require('path').resolve;

//synchronous version (find on CMD)
function matchGEOIDSync(options, callback) {
  var polyfile = resolve(options.polyfile);
  var pointfile = resolve(options.coordinatesfile);
  var fields = options.fields || ["GEOID"];
  var polyGeoJSON = JSON.parse(fs.readFileSync(polyfile, {encoding: 'utf-8'}))
  var pointGeoJSON = JSON.parse(fs.readFileSync(pointfile, {encoding: 'utf-8'}));
  var err = [];
  var points = pointGeoJSON.features;
  var polies = polyGeoJSON.features;
  points.forEach(function(point) {
    polies.forEach(function(poly) {
      var pt;
      if (point.geometry.coordinates.length != 2) {
        var ptpol = turf.polygon(point.geometry.coordinates);
        pt = turfCentroid(ptpol);
      } else {
        pt = turf.point(point.geometry.coordinates);
      }

      if (poly.geometry.coordinates[0].length >= 4) {
        var pol = turf.polygon(poly.geometry.coordinates);
        var isIn = false;
        try {
          isIn = turfBooleanPointInPolygon(pt, pol);
          if (isIn) {
            if (typeof fields === "string") {
              fields = [fields];
            }
            fields.forEach(function(fname) {
              point.properties[fname] = poly.properties[fname];
            })
          }
        }
        catch(e) {
          err.push({
            error: e,
            feature: point.properties
          })
          if (typeof callback !== "function") {
            console.warn('Could not match: ', (point.properties.name || point.properties.Name || point.properties.NAME || point.properties));
          }
        }
      }

    })
  })
  if (typeof callback === "function") {
    callback(err, pointGeoJSON);
  } else {
    if (require.main == module) {
      //stdout
      console.log(JSON.stringify(pointGeoJSON));
    } else {
      //return
      return pointGeoJSON;
    }
  }
}

//async version for not blocking io
function matchGEOIDAsync(options, callback) {
  var polyfile = resolve(options.polyfile);
  var pointfile = resolve(options.coordinatesfile);
  var fields = options.fields || ["GEOID"];
  fs.readFile(polyfile,{encoding: 'utf-8'}, function(err, file) {
    var polyGeoJSON = JSON.parse(file);
    fs.readFile(pointfile,{encoding: 'utf-8'}, function(err, file) {
      var pointGeoJSON = JSON.parse(file)
      err = [];
      var points = pointGeoJSON.features;
      var polies = polyGeoJSON.features;
      points.forEach(function(point) {
        polies.forEach(function(poly) {
          var pt;
          if (point.geometry.coordinates.length != 2) {
            var ptpol = turf.polygon(point.geometry.coordinates);
            pt = turfCentroid(ptpol);
          } else {
            pt = turf.point(point.geometry.coordinates);
          }

          if (poly.geometry.coordinates[0].length >= 4) {
            var pol = turf.polygon(poly.geometry.coordinates);
            var isIn = false;
            try {
              isIn = turfBooleanPointInPolygon(pt, pol);
              if (isIn) {
                if (typeof fields === "string") {
                  fields = [fields];
                }
                fields.forEach(function(fname) {
                  point.properties[fname] = poly.properties[fname];
                })
              }
            }
            catch(e) {
              err.push({
                error: e,
                feature: point.properties
              })
              if (typeof callback !== "function") {
                console.warn('Could not match: ', (point.properties.name || point.properties.Name || point.properties.NAME || point.properties));
              }
            }
          }

        })
      })
      if (!err.length) err = null;
      if (typeof callback === "undefined") {
        callback(err, pointGeoJSON);
      }
    })
  })
}

function matchGEOID(options, callback) {
  if (options.sync) {
    return matchGEOIDSync(options,callback)
  } else {
    return matchGEOIDAsync(options,callback)
  }
}

module.exports.matchGEOID = matchGEOID;
