// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./CellData.sol";

contract COV is ERC721, Ownable {
    using Strings for uint256;
    using Base64 for bytes;

    // Custom error for unauthorized access
    error NotGameContract(address caller);

    // Modifier to restrict function access to the game contract
    modifier onlyGameContract() {
        if (msg.sender != gameContract) {
            revert NotGameContract(msg.sender);
        }
        _;
    }

    address public gameContract;

    mapping(uint256 => uint256) public tokenGameId;
    mapping(uint256 => mapping(uint32 => bool)) private tokenIslands;

    // Mappings to store movement data and colors for each cov token
    mapping(uint256 => address[]) private tokenPlayers;
    mapping(uint256 => uint8[]) private tokenMovementQs;
    mapping(uint256 => uint8[]) private tokenMovementRs;
    mapping(uint256 => uint256[]) private tokenMovementIndices;

    mapping(uint256 => uint8[3]) private hullColors;
    mapping(uint256 => uint8[3]) private windowColors;
    mapping(uint256 => uint8[3]) private mastColors;

    // Define SVG constants
    string constant svgHeader =
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 500 500">';
    string constant svgFooter = "</svg>";

    constructor(
        address initialOwner
    ) ERC721("COV", "COV") Ownable(initialOwner) {}

    // Function to set the game contract address
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }

    // Function to get a unique cell ID based on q and r coordinates
    function getCellId(int16 q, int16 r) public pure returns (uint32) {
        return (uint32(uint16(q)) << 16) | uint16(r);
    }

    // Function to convert scaled integers to strings
    function scaledIntToString(
        uint32 value
    ) internal pure returns (string memory) {
        // Convert scaled integer to string with up to 6 decimal places
        uint256 integerPart = uint256(value) / 1e6;
        uint256 fractionalPart = uint256(value) % 1e6;

        if (fractionalPart == 0) {
            return integerPart.toString();
        }

        // Remove trailing zeros from fractional part
        while (fractionalPart % 10 == 0) {
            fractionalPart /= 10;
        }

        return
            string(
                abi.encodePacked(
                    integerPart.toString(),
                    ".",
                    fractionalPart.toString()
                )
            );
    }

    function generateSVG(
        uint256 tokenId
    ) internal view returns (string memory) {
        // Retrieve colors for the token
        uint8[3] memory hullColor = hullColors[tokenId];
        uint8[3] memory windowColor = windowColors[tokenId];
        uint8[3] memory mastColor = mastColors[tokenId];

        // Dynamically generate the <defs> section with the token's colors
        string memory dynamicDefs = string(
            abi.encodePacked(
                "<defs>",
                '<style type="text/css">',
                ".hexagon { stroke: rgb(215, 114, 127); fill: none; visibility: hidden; }",
                ".island { fill: rgb(",
                uintToString(hullColor[0]),
                ",",
                uintToString(hullColor[1]),
                ",",
                uintToString(hullColor[2]),
                "); }",
                ".background { fill: #202424; visibility: visible; }",
                ".travel { stroke: rgb(",
                uintToString(windowColor[0]),
                ",",
                uintToString(windowColor[1]),
                ",",
                uintToString(windowColor[2]),
                "); stroke-width: 2px; fill: none; }",
                ".travelMarker { stroke: rgb(",
                uintToString(windowColor[0]),
                ",",
                uintToString(windowColor[1]),
                ",",
                uintToString(windowColor[2]),
                "); fill: rgb(",
                uintToString(windowColor[0]),
                ",",
                uintToString(windowColor[1]),
                ",",
                uintToString(windowColor[2]),
                "); visibility: hidden; }",
                ".winner { stroke: rgb(",
                uintToString(mastColor[0]),
                ",",
                uintToString(mastColor[1]),
                ",",
                uintToString(mastColor[2]),
                "); stroke-width: 4px; fill: none; }",
                ".travelMarkerWinner { stroke: rgb(",
                uintToString(mastColor[0]),
                ",",
                uintToString(mastColor[1]),
                ",",
                uintToString(mastColor[2]),
                "); fill: rgb(",
                uintToString(mastColor[0]),
                ",",
                uintToString(mastColor[1]),
                ",",
                uintToString(mastColor[2]),
                "); visibility: hidden; }",
                "</style>",
                '<polygon id="hexagon" points="0,-15 12.99,-7.5 12.99,7.5 0,15 -12.99,7.5 -12.99,-7.5" />',
                '<rect id="island" x="-7.5" y="-7.5" width="15" height="15" />',
                '<marker id="shipStart" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="0">',
                '<rect x="2.5" y="2.5" width="5" height="5" class="travelMarker" />',
                "</marker>",
                '<marker id="shipEnd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">',
                '<path d="M 2.5,2.5 L 7.5,7.5 M 7.5,2.5 L 2.5,7.5" class="travelMarker" />',
                "</marker>",
                '<marker id="shipStartWinner" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="0">',
                '<rect x="2.5" y="2.5" width="5" height="5" class="travelMarkerWinner" />',
                "</marker>",
                '<marker id="shipEndWinner" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto">',
                '<path d="M 2.5,2.5 L 7.5,7.5 M 7.5,2.5 L 2.5,7.5" class="travelMarkerWinner" />',
                "</marker>",
                "</defs>"
            )
        );

        // Background rectangle
        string
            memory background = '<rect x="0" y="0" width="100%" height="100%" class="background" />';

        // Hexagons and islands group
        string memory hexagonsGroup = '<g id="hexagons">';
        CellData.Cell[] memory cells = CellData.getInitialCells();

        for (uint256 i = 0; i < cells.length; i++) {
            CellData.Cell memory cell = cells[i];

            string memory x = scaledIntToString(cell.x);
            string memory y = scaledIntToString(cell.y);

            hexagonsGroup = string(
                abi.encodePacked(
                    hexagonsGroup,
                    '<use href="#hexagon" class="hexagon" x="',
                    x,
                    '" y="',
                    y,
                    '" />'
                )
            );

            uint32 cellId = getCellId(cell.q, cell.r);
            if (tokenIslands[tokenId][cellId]) {
                hexagonsGroup = string(
                    abi.encodePacked(
                        hexagonsGroup,
                        '<use href="#island" class="island" x="',
                        x,
                        '" y="',
                        y,
                        '" />'
                    )
                );
            }
        }
        hexagonsGroup = string(abi.encodePacked(hexagonsGroup, "</g>"));

        // Travels group
        string memory travelsGroup = '<g id="travels">';
        address[] storage players = tokenPlayers[tokenId];
        uint8[] storage qs = tokenMovementQs[tokenId];
        uint8[] storage rs = tokenMovementRs[tokenId];
        uint256[] storage indices = tokenMovementIndices[tokenId];

        for (uint256 i = 0; i < players.length; i++) {
            uint256 startIndex = indices[i];
            uint256 endIndex = indices[i + 1];

            string memory pathData = "M ";
            for (uint256 j = startIndex; j < endIndex; j++) {
                (uint32 xCoord, uint32 yCoord) = getXYFromQR(
                    qs[j],
                    rs[j],
                    cells
                );

                pathData = string(
                    abi.encodePacked(
                        pathData,
                        scaledIntToString(xCoord),
                        " ",
                        scaledIntToString(yCoord),
                        (j < endIndex - 1) ? " L " : ""
                    )
                );
            }

            travelsGroup = string(
                abi.encodePacked(
                    travelsGroup,
                    '<path d="',
                    pathData,
                    '" class="travel" marker-start="url(#shipStart)" marker-end="url(#shipEnd)" />'
                )
            );
        }
        travelsGroup = string(abi.encodePacked(travelsGroup, "</g>"));

        // Winner group
        string memory winnersGroup = '<g id="winners">';
        uint256 winnerStartIndex = indices[indices.length - 1];
        string memory winnerPathData = "M ";

        for (uint256 j = winnerStartIndex; j < qs.length; j++) {
            (uint32 xCoord, uint32 yCoord) = getXYFromQR(qs[j], rs[j], cells);

            winnerPathData = string(
                abi.encodePacked(
                    winnerPathData,
                    scaledIntToString(xCoord),
                    " ",
                    scaledIntToString(yCoord),
                    (j < qs.length - 1) ? " L " : ""
                )
            );
        }

        winnersGroup = string(
            abi.encodePacked(
                winnersGroup,
                '<path d="',
                winnerPathData,
                '" class="winner" marker-start="url(#shipStartWinner)" marker-end="url(#shipEndWinner)" />'
            )
        );
        winnersGroup = string(abi.encodePacked(winnersGroup, "</g>"));

        // Assemble the final SVG
        return
            string(
                abi.encodePacked(
                    svgHeader,
                    dynamicDefs,
                    background,
                    hexagonsGroup,
                    travelsGroup,
                    winnersGroup,
                    svgFooter
                )
            );
    }

    // Helper function to convert uint8 to string
    function uintToString(uint8 value) internal pure returns (string memory) {
        return Strings.toString(uint256(value));
    }

    // Function to map q and r coordinates to x and y pixel coordinates
    function getXYFromQR(
        uint8 q,
        uint8 r,
        CellData.Cell[] memory cells
    ) internal pure returns (uint32 x, uint32 y) {
        // Convert uint8 q and r to int16 safely
        int16 qInt = int16(uint16(q));
        int16 rInt = int16(uint16(r));

        for (uint256 i = 0; i < cells.length; i++) {
            if (cells[i].q == qInt && cells[i].r == rInt) {
                return (cells[i].x, cells[i].y);
            }
        }
        revert("Cell not found");
    }

    // Override tokenURI function to generate token metadata
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // ownerOf will revert if token does not exist
        address owner = ownerOf(tokenId);

        string memory svg = generateSVG(tokenId);
        string memory image = string(
            abi.encodePacked("data:image/svg+xml;base64,", bytes(svg).encode())
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "COV #',
                tokenId.toString(),
                '", "description": "COV", "gameId": "',
                tokenGameId[tokenId].toString(),
                '", "image": "',
                image,
                '"}'
            )
        );

        string memory encodedJson = bytes(json).encode();

        return
            string(
                abi.encodePacked("data:application/json;base64,", encodedJson)
            );
    }

    // Mint function to create a new token with associated data
    function mint(
        address to,
        uint256 tokenId,
        uint256 gameId,
        int16[] calldata islandsQ,
        int16[] calldata islandsR,
        address[] calldata playersInput,
        uint8[] calldata qsInput,
        uint8[] calldata rsInput,
        uint256[] calldata indicesInput,
        uint8[] calldata winnerQs,
        uint8[] calldata winnerRs,
        uint8[3] calldata hullColor,
        uint8[3] calldata windowColor,
        uint8[3] calldata mastColor
    ) external onlyGameContract {
        require(
            islandsQ.length == islandsR.length,
            "Input arrays must have the same length"
        );
        require(
            qsInput.length == rsInput.length,
            "Movement arrays must have the same length"
        );
        require(
            indicesInput.length == playersInput.length + 1,
            "Invalid indices length"
        );
        _safeMint(to, tokenId);
        tokenGameId[tokenId] = gameId;

        // Store islands data
        for (uint256 i = 0; i < islandsQ.length; i++) {
            uint32 cellId = getCellId(islandsQ[i], islandsR[i]);
            tokenIslands[tokenId][cellId] = true;
        }

        // Store movement data
        // Store players
        for (uint256 i = 0; i < playersInput.length; i++) {
            tokenPlayers[tokenId].push(playersInput[i]);
        }

        // Store qs
        for (uint256 i = 0; i < qsInput.length; i++) {
            tokenMovementQs[tokenId].push(qsInput[i]);
        }

        // Store rs
        for (uint256 i = 0; i < rsInput.length; i++) {
            tokenMovementRs[tokenId].push(rsInput[i]);
        }

        // Store indices
        for (uint256 i = 0; i < indicesInput.length; i++) {
            tokenMovementIndices[tokenId].push(indicesInput[i]);
        }

        // Store winner data
        for (uint256 i = 0; i < winnerQs.length; i++) {
            tokenMovementQs[tokenId].push(winnerQs[i]);
            tokenMovementRs[tokenId].push(winnerRs[i]);
        }

        hullColors[tokenId] = hullColor;
        windowColors[tokenId] = windowColor;
        mastColors[tokenId] = mastColor;
    }

    function getIslands(
        uint256 tokenId
    ) external view returns (uint8[] memory qs, uint8[] memory rs) {
        uint256 count;
        CellData.Cell[] memory cells = CellData.getInitialCells();

        // First pass: Count the islands
        for (uint256 i = 0; i < cells.length; i++) {
            uint32 cellId = getCellId(cells[i].q, cells[i].r);
            if (tokenIslands[tokenId][cellId]) {
                count++;
            }
        }

        qs = new uint8[](count);
        rs = new uint8[](count);
        uint256 index;

        // Second pass: Populate the q and r arrays
        for (uint256 i = 0; i < cells.length; i++) {
            uint32 cellId = getCellId(cells[i].q, cells[i].r);
            if (tokenIslands[tokenId][cellId]) {
                require(cells[i].q >= 0 && cells[i].q <= 255, "q out of range");
                require(cells[i].r >= 0 && cells[i].r <= 255, "r out of range");

                qs[index] = uint8(uint16(cells[i].q));
                rs[index] = uint8(uint16(cells[i].r));
                index++;
            }
        }

        return (qs, rs);
    }

    function getPlayers(
        uint256 tokenId
    ) external view returns (address[] memory) {
        return tokenPlayers[tokenId];
    }

    function getMovements(
        uint256 tokenId
    )
        external
        view
        returns (uint8[] memory qs, uint8[] memory rs, uint256[] memory indices)
    {
        return (
            tokenMovementQs[tokenId],
            tokenMovementRs[tokenId],
            tokenMovementIndices[tokenId]
        );
    }

    function getColors(uint256 tokenId)
    external
    view
    returns (
        uint8[3] memory hullColor,
        uint8[3] memory windowColor,
        uint8[3] memory mastColor
    )
{
    return (hullColors[tokenId], windowColors[tokenId], mastColors[tokenId]);
}
}
