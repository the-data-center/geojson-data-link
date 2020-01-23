#!/usr/bin/env node

const resolve = require('path').resolve;
const base = require('./matchGEOID');
const argv = require('yargs')
argv.usage('Link fields between a GeoJSON point file and a GeoJSON polygon file')
.example('$0 --polyfile ./myPolyFile.geojson --coordinatesfile ./myPointFile.goejson --fields GEOID,STATEFP', 'Finds which polygon all the points in a geojson file are inside of and then adds the GEOID and STATEFP properties from the polygon to the properties of any point falling within the polygon')
.alias('p', 'polyfile').describe('p', 'GeoJSON file with Polygons and GEOID in the properties')
.alias('c', 'coordinatesfile').describe('c', 'GeoJSON with coordinates/points to be given correct GEOID. (If it has polygons, the centroid will be used)')
.alias('o', 'output')
.describe('o', 'output format; options include geojson (default), csv, and json')
.alias('f', 'fields').describe('f', 'Comma separated fields to match (default: GEOID)')
.help('h').alias('h', 'help').showHelpOnFail(true).argv;

if (require.main == module) {
  //command line
  if (argv.p && argv.c) {
    var fields = ["GEOID"];
    if (argv.f) {
      fields = argv.f.split(',')
    }
    base.matchGEOID({
      polyfile: resolve(argv.p),
      coordinatesfile: resolve(argv.c),
      fields: fields,
      sync: true,
      output: argv.o || 'geojson'
    }, function(err, newFile) {
      var output = argv.o || "geojson";
      if (output == "geojson") console.log(JSON.stringify(newFile));
      else if (output == "csv") {
        let rows = [];
        let data = newFile.features;
        data.forEach(function(row) {
          if (row.geometry && row.geometry.type == "Point" && row.geometry.coordinates && row.geometry.coordinates.length > 1) {
            row.properties.lng = row.geometry.coordinates[0]
            row.properties.lat = row.geometry.coordinates[1]
          }
          rows.push(row.properties)
        })
        const items = rows;
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csv = csv.join('\r\n')
        console.log(csv);
      } else if (output == "json") {
        let rows = [];
        let data = newFile.features;
        data.forEach(function(row) {
          if (row.geometry && row.geometry.type == "Point" && row.geometry.coordinates && row.geometry.coordinates.length > 1) {
            row.properties.lng = row.geometry.coordinates[0]
            row.properties.lat = row.geometry.coordinates[1]
          }
          rows.push(row.properties)
        })
        console.log(JSON.stringify(rows, undefined, 2));
      }
    })
  } else {
    console.error('Incorrect number of arguments. You must provide both filenames. Use -h for help')
  }
} else {
  //imported as a library
  module.exports = base;
}
