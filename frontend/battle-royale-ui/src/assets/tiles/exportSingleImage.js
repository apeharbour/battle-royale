// node js script to do the following:
// 1. Read heaxgaon_tiles.svg from the filesystem and convert to object
// 2. Find all polygons in the svg
// 2a. Run through a loop 1..128 to generate each tile by setting the class of specific polygons to "visible"
// 2b. The loop index determines, how to set the classes in the svg for each tile
//     The loop index is interpreted as binary, depending on which bit is set, the polygon with that id is made visible
//     To make a polygon visible, set the class to "visible"
//     The codes are as follows:
//       bitmask: polygon-id
//       0b000001: west
//       0b000010: southwest
//       0b000100: northwest
//       0b001000: southeast
//       0b010000: norheast
//       0b100000: east
// 2d. The loop index also determines the file name to save the tile as
// 3. Save each tile as a separate png file

var fs = require("fs");
var svg2png = require("svg2png");
var path = require("path");

const svg = fs.readFileSync("hexagon_tile.svg", "utf8");
svg2png(svg, { width: 156, height: 180 })
  .then((buffer) =>
    fs.writeFileSync(path.join('background' + ".png"), buffer)
  )
  .catch((e) => console.error(e));
