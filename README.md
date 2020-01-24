# GeoJSON Data Link
A NodeJS library to link properties on two different GeoJSON files by determining if a geographic point is within a larger geographic region and linking the metadata. This project is sponsored by [The Data Center of Southeast Louisiana](https://www.datacenterresearch.org)

## Installation

`npm install geojson-data-link`

or

`yarn install geojson-data-link`

## About The Data Center
[The Data Center of Southeast Louisiana](https://www.datacenterresearch.org) is a fully independent, data-focused non-profit with a mission to build prosperous, inclusive, and sustainable communities by making informed decisions possible. If you find this tool useful, please visit [our web site to learn more](https://www.datacenterresearch.org) about our work and consider [supporting us](https://www.datacenterresearch.org/support-us) in our mission.

## Usage

#### Command Line Interface
The command line version accepts as arguments the two geojson files, the fields you want to merge, and some formatting options. It returns your new, merged file to stdout. (If you don't work with the CLI often, you can append `> filename.geojson` to the command to save the output to a file instead of display it in the terminal.)

The long example might be:

```
npx geojson-data-link --coordinatesfile ~/geography/library-locations.geojson --polyfile ~/geography/census-tracts.geojson --fields GEOID STATEFP > ~/geography/libraries-with-new-data.geojson
```

This is equivalent to:

```
npx geojson-data-link -c ~/geography/library-locations.geojson -p ~/geography/census-tracts.geojson -f GEOID STATEFP > ~/geography/libraries-with-new-data.geojson
```

Here's the options:
```
Link fields between a GeoJSON point file and a GeoJSON polygon file

Options:
  -p, --polyfile         GeoJSON file with Polygons and GEOID in the properties                                                                                                                          [required]
  -c, --coordinatesfile  GeoJSON with coordinates/points to be given correct GEOID. (If it has polygons, the centroid will be used)                                                                      [required]
  -o, --output           output format; options include geojson (default), csv, and json
  -r, --reverse          Copy the data from the point data to the polygon data instead                                                                                                                    [boolean]
  -b, --beautify         Beautify the output                                                                                                                                                              [boolean]
  -f, --fields           Fields to match, separated by a space (default: GEOID)                                                                                                                  [array] [required]
  --version, -v          Show version number                                                                                                                                                              [boolean]
  -h, --help             Show help                                                                                                                                                                        [boolean]

Examples:
  index.js -c ./myPointFile.geojson -p ./myPolyFile.geojson -f GEOID STATEFP

  index.js --polyfile ./myPolyFile.geojson --coordinatesfile ./myPointFile.goejson --fields GEOID STATEFP --beautify --reverse
```

#### As a Library

```
const match = require('./matchGEOID').matchGEOID;
const polyfile = '~/geography/census-track.geojson';
const coordinatesfile = '~/geography/library-locations.geojson';

match({
  polyfile: polyfile,
  coordinatesfile: coordinatesfile,
  fields: ["GEOID","STATEFP","COUNTYFP","TRACTCE"],
  sync: false,
  reverse: false
}, function(err, asyncCoordsFile) {
  if (err) console.error(err);
  else console.log(JSON.stringify(asyncCoordsFile));
});

```
Your options are:

- `polyfile`: the geojson file with your polygon features (i.e., regions to check)
- `coordinatesfile`: the geojson file with your point/coordinate features
- `fields`: an array of fields to copy over after linking
- `sync`: whether the command to get the files runs asynchronously or synchronously.

If you set `sync: true`, be warned that it will block I/O while it fetches the (potentially large) files. It's faster for one-off scripts but is not recommended for larger projects.
