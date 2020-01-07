#!/usr/bin/env node

const resolve = require('path').resolve;
const base = require('./matchGEOID');
const argv = require('yargs')
.usage('Add GEOID to GeoJSON point file')
.example('$0 --polyfile ./myPolyFile.geojson --coordinatesfile ./myPointFile.goejson --fields GEOID,STATEFP', 'Finds which polygon all the points in a geojson file are inside of and then adds the GEOID and STATEFP properties from the polygon to the properties of any point falling within the polygon')
.alias('p', 'polyfile').describe('p', 'GeoJSON file with Polygons and GEOID in the properties')
.alias('c', 'coordinatesfile').describe('c', 'GeoJSON with coordinates/points to be given correct GEOID. (If it has polygons, the centroid will be used)')
.alias('f', 'fields').describe('f', 'Comma separated fields to match (default: GEOID)')
.help('h').alias('h', 'help')
.showHelpOnFail(true)
.argv;

if (require.main == module) {
  //command line
  if(argv.p && argv.c) {
		var fields = ["GEOID"];
		if (argv.f) {
			fields = argv.f.split(',')
		}
    base.matchGEOID({
      polyfile: resolve(argv.p),
      coordinatesfile: resolve(argv.c),
      fields: fields,
			sync: true
    }, function(err, newfile) {
			console.log(JSON.stringify(newfile))
		})
  } else {
    console.error('Incorrect number of arguments. You must provide both filenames. Use -h for help')
  }
} else {
  //imported as a library
  module.exports = base;
}
