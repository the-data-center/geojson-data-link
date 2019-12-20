const match = require('./matchGEOID').matchGEOID;
const polyfile = '../../../geography/la-census-track.geojson';
const coordinatesfile = '../../../geography/nola-library-locations.geojson';

match({
  polyfile: polyfile,
  coordinatesfile: coordinatesfile,
  fields: ["GEOID","STATEFP","COUNTYFP","TRACTCE"],
  sync: true
}, function(err, asyncCoordsFile) {
  if (err) console.error(err);
  else console.log(JSON.stringify(asyncCoordsFile));
});
