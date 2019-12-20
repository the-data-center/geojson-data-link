# GEOID Matcher
A NodeJS library to link properties on two different GeoJSON files by determining if a geographic point is within a larger geographic region and linking the metadata.

## Non-Profit Sponsor
This project is sponsored by an important non-profit, [The Data Center of Southeast Louisiana](https://www.datacenterresearch.org). The Data Center produces high-quality, independent reports and was incredibly important during the Katrina recovery. Today, they produce information on everything from life-expectancy to coastal erosion to youth programs. These sorts of non-profits don't always get media coverage so if you find this library useful, please consider donating to an important, local, data-driven organization:
https://www.datacenterresearch.org/support-us/ 

## Real World Example
You may have a geojson file with the name, hours, and lat/long coordinates of libraries in your state. You may also have another geojson file with your state's census tracts that has polygons and GEOID data in the properties. This library would be able to find the census tract of each library (based on latitude/longitude) copy various properties from your census tract GeoJSON).
## Installation

`npm install geoid-matcher`

or

`yarn install geoid-matcher`

## Usage

#### In a Node Script

```
const match = require('./matchGEOID').matchGEOID;
const polyfile = '~/geography/census-track.geojson';
const coordinatesfile = '~/geography/library-locations.geojson';

match({
  polyfile: polyfile,
  coordinatesfile: coordinatesfile,
  fields: ["GEOID","STATEFP","COUNTYFP","TRACTCE"],
  sync: false
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

If you set `sync: true`, be warned that it will block up your program while it fetches the files. So, don't use it as part of a bigger application. It is faster for one-off scripts, though, so if your .

#### Command Line
The command line version accepts as arguments the two geojson files and the fields you want to merge. It returns your new, merged file to stdout. (If you don't work with the CLI often, you can append `> filename.geojson` to the command to save the output to a file instead of display it in the terminal.)

The long example might be:

```
node index.js --coordinatesfile ~/geography/nola-library-locations.geojson --polyfile ~/geography/la-census-track.geojson --fields GEOID,STATEFP > ~/geography/libraries-with-new-data.geojson
```

This is equivalent to:

```
node index.js -c ~/geography/nola-library-locations.geojson -p ~/geography/la-census-track.geojson -f GEOID,STATEFP > ~/geography/libraries-with-new-data.geojson
```

Here's the options:
```
Options:
  --version              Show version number                           [boolean]
  -p, --polyfile         GeoJSON file with Polygons and GEOID in the properties
  -c, --coordinatesfile  GeoJSON with coordinates/points to be given correct
                         GEOID. (If it has polygons, the centroid will be used)
  -f, --fields           Comma separated fields to match (default: GEOID)
  -h, --help             Show help                                     [boolean]
```
