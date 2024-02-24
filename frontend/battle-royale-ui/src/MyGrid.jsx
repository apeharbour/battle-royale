import React from 'react';
import { HexGrid, Layout, Hexagon, HexUtils, Hex } from 'react-hexgrid';

function Circle({q, r, s, layout}) {
    console.log({layout})
    const hex = new Hex(q, r, s)
    const point = HexUtils.hexToPixel(hex, layout)

    return (
        <circle cx={point.x} cy={point.y} r={10} />
    )
}

export default function MyGrid() {
    const size = { x: 4, y: 4 };
    const flat = true; // or false for pointy hexes
    const spacing = 1.1;
    const origin = { x: 0, y: 0 };

    // Create layout with calculated properties
    const layout = new Layout({flat, size, origin});
    console.log({layout})

    return (
        <HexGrid width={400} height={400} viewBox="-50 -50 100 100">
            <Layout size={size} flat={flat} spacing={spacing} origin={origin}>
                {/* Place Hexagons here */}
                <Hexagon q={0} r={0} s={0} />
                {/* ... other hexagons */}
            <Circle q={0} r={0} s={0} layout={layout} />
            </Layout>



        </HexGrid>
    );
}