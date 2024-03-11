// node js script to do the following:
// 1. Read heaxgaon_tiles.svg from the filesystem and convert to object
// 2. Find all polygons in the svg
// 2a. Run through a loop 1..128 to generate each tile by setting the class of specific polygons to "visible"
// 2b. The loop index determines, how to set the classes in the svg for each tile
//     The loop index is interpreted as binary, depending on which bit is set, the polygon with that id is made visible
//     To make a polygon visible, set the class to "visible"
//     The codes are as follows:
//       bitmask: polygon-id
//       0b000001: east
//       0b000010: northeast
//       0b000100: northwest
//       0b001000: west
//       0b010000: southwest
//       0b100000: southeast
// 2d. The loop index also determines the file name to save the tile as
// 3. Save each tile as a separate png file 

var fs = require('fs');
var svg2png = require('svg2png');
var path = require('path');

const svg = fs.readFileSync('hexagon_tile.svg', 'utf8');

var polygons = [
    'east',
    'northeast',
    'northwest',
    'west',
    'southwest',
    'southeast'
    ];

let tiles = [...Array(64).keys()]

async function generateTile(tile) {
    var tileSvg = svg;
    for (var j = 0; j < 6; j++) {
        if (tile & (1 << j)) {
            tileSvg = tileSvg.replace(new RegExp('id="' + polygons[j] + '"'), 'id="' + polygons[j] + '" class="visible"');
        }
    }
    console.log('tile', tile, tile.toString(2));
    await
    svg2png(tileSvg, { width: 156, height: 180 })
        .then(buffer => fs.writeFileSync(path.join('clean', `water${tile}` + '.png'), buffer))
        .catch(e => console.error(e));
}

tiles.forEach(tile => generateTile(tile));
