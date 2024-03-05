// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

struct Color {
    uint8 r;
    uint8 g;
    uint8 b;
}

enum ShipType {
    ship1Master,
    ship3Master,
    ship4Master,
    ship5Master,
    shipYacht
}

error ShipNotMinted(uint256 tokenId);

string constant SVG_HEADER = '<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" version="1.1">';
string constant SVG_FOOTER = "</svg>";
string constant SIGNETS = '<g id="signets" transform="scale(10)"> <g id="signet1" class="signet1"> <path d="M15 13 h1 v1 h-1 z" /> <path d="M15 12 h1 v1 h-1 z" /> <path d="M15 11 h1 v1 h-1 z" /> <path d="M14 14 h1 v1 h-1 z" /> </g> </g>';

string constant SHIP_1MASTER = '<g transform="scale(10)"> <g id="border" class="border"> <path d="M6 15 h2 v-2 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h3 v9 h8 v3 h-1 v1 h-1 v1 h-1 v1 h-14 v-1 h-2 v-2 h-1 z" /> <g class="flagsBorder"> <path d="M13 5 h5 v3 h-5z" /> </g> </g> <g> <path id="hull" d="M7 16 h 18 v1 h-1 v1 h-1 v1 h-1 v1 h-12 v-1 h-2 v-2  h-1  z" class="hull" /> <path id="windowLine" d="M7 16 h18 v1 h-18 z" class="window-line" /> </g> <g id="masts" class="masts"> <path d="M16.5 7 v9" /> </g> <g id="flags" class="flags flagsBorder"> <path d="M14 6.5 h3" /> </g> <g id="sails" fill="url(#sailGradient)"> <path d="M9 15 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h1 v7 z" /> </g> </g>';
string constant SHIP_3MASTER = '<g transform="scale(10)"> <g id="border" class="border"> <path d="M3 9 h1 v-1 h1 v-1 h1 v-1 h3 v-1 h7 v-1 h3 v2 h1 v-1 h3 v2 h1 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1 v6 h-2 v1 h-1 v1 h-1 v1 h-1 v1 h-17 v-4 h-2 v-4 h-1 v-1 h-1 z"/> <g class="flagsBorder"> <path d="M7 4 h5 v3 h-5z" /> <path d="M14 3 h5 v3 h-5z" /> <path d="M19 4 h4 v3 h-4z" /> </g> </g> <g> <path id="hull" d="M6 16 h 22 v1 h-2 v1 h-1 v1 h-1 v1 h-1 v1 h-15 v-1 h1 v-1 h1 v-1 h-2 v-1 h-2 z" class="hull" /> <path id="window-line" d="M10 18 h15 v1 h-15 z" class="windowLine"/> <g id="windows" class="window"> <path id="window-1" d="M12 18 h1 v1 h-1 z" /> <path id="window-1" d="M12 18 h1 v1 h-1 z" /> <path id="window-2" d="M12 18 h1 v1 h-1 z" /> </g> </g> <g id="masts" class="masts"> <path d="M10.5 6 v10" /> <path d="M17.5 5 v11" /> <path d="M21.5 6 v10" /> </g> <g id="flags" class="flags flagsBorder"> <path d="M8 5.5 h3" /> <path d="M15 4.5 h3" /> <path d="M20 5.5 h2" /> </g> <g id="sails" fill="url(#sailGradient)"> <rect x="12" y="6" width="5" height="9" /> <rect x="19" y="7" width="2" height="8" /> <path d="M7 7 h3 v8 h-3 v-1 h-1 v-1 h-1 v-1 h-1  v-2 h1 v-1 h1 v-1 h1 z"/> <path d=" M22 8 h1 v1 h1 v1 h1 v1 h1 v1 h1 v1  h1 v2 h-6 z" /> </g> </g>';
string constant SHIP_4MASTER = '<g transform="scale(10)"> <g id="border" class="border"> <path d="M1 7 h1 v-1 h1 v-1 h4 v-1 h6 v-1 h3 v2 h3 v-1 h3 v3 h3 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1 v5 h-3 v1 h-1 v1 h-1 v1 h-1 v2 h-21 v-3 h1 v-2 h-2 v-4 h-1v-1 h-1 z"/> <g class="flagsBorder"> <path d="M5 3 h5 v3 h-5z" /> <path d="M11 2 h5 v3 h-5z" /> <path d="M18 3 h4 v3 h-4z" /> <path d="M21 6 h4 v3 h-4z" /> </g> </g> <g> <path id="hull" d="M4 16 h 26 v1 h-3 v1 h-1 v1 h-1 v1 h-1 v2 h-19 v-1 h1 v-1 h1 v-1 h1 v-1 h-2 v-1 h-2 z" class="hull" /> <path id="window-line" d="M8 18 h18 v1 h-18 z" class="windowLine"/> <g id="windows" class="window"> <path d="M13 18 h1 v1 h-1 z" /> <path d="M10 18 h1 v1 h-1 z" /> <path d="M19 18 h1 v1 h-1 z" /> <path d="M22 18 h1 v1 h-1 z" /> </g> </g> <g id="masts" class="masts"> <path d="M8.5 5 v11" /> <path d="M14.5 4 v12" /> <path d="M20.5 5 v11" /> <path d="M23.5 8 v8" /> </g> <g id="flags" class="flags flagsBorder"> <path d="M6 4.5 h3" /> <path d="M12 3.5 h3" /> <path d="M19 4.5 h2" /> <path d="M22 7.5 h2" /> </g> <g id="sails" fill="url(#sailGradient)"> <rect x="10" y="5" width="4" height="10" /> <rect x="16" y="6" width="4" height="9" /> <path d="M4 6 h4 v9 h-3 v-1 h-1 v-1 h-1 v-1 h-1  v-4 h1 v-1 h1 v-1 h1 z"/> <path d=" M24 9 h1 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1 v1 h-6 z" /> </g> </g>';
string constant SHIP_5MASTER = '<g transform="scale(10)"> <g id="border" class="border"> <path d="M0 8 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h3 v-1 h3 v1 h2 v-1 h3 v1 h2 v-1 h3 v3 h1 v-1 h3 v3 h3 v1 h1 v1 h1 v1 h1 v1 h1 v1 h1 v5 h-3 v1 h-1 v1 h-1 v1 h-1 v2 h-22 v-3 h1 v-2 h-2 v-4 h-1 v-1 h-1 v-1 h-1 z" /> <g class="flagsBorder"> <path d="M5 2 h5 v3 h-5z" /> <path d="M10 2 h5 v3 h-5z" /> <path d="M15 2 h5 v3 h-5z" /> <path d="M20 4 h4 v3 h-4z" /> <path d="M23 7 h4 v3 h-4z" /> </g> </g> <g> <path id="hull" d="M4 16 h 27 v1 h-3 v1 h-1 v1 h-1 v1 h-1 v2 h-20 v-1 h1 v-1 h1 v-1 h1 v-1 h-2 v-1 h-2 z" class="hull" /> <path id="window-line" d="M8 18 h19 v1 h-19 z" class="windowLine" /> <g id="windows" class="window"> <path d="M11 18 h1 v1 h-1 z" /> <path d="M14 18 h1 v1 h-1 z" /> <path d="M17 18 h1 v1 h-1 z" /> <path d="M20 18 h1 v1 h-1 z" /> <path d="M23 18 h1 v1 h-1 z" /> </g> </g> <g id="masts" class="masts"> <path d="M8.5 4 v12" /> <path d="M13.5 4 v12" /> <path d="M18.5 4 v12" /> <path d="M22.5 6 v10" /> <path d="M25.5 9 v7" /> </g> <g id="flags" class="flags flagsBorder"> <path d="M6 3.5 h3" /> <path d="M11 3.5 h3" /> <path d="M16 3.5 h3" /> <path d="M21 5.5 h2" /> <path d="M24 8.5 h2" /> </g> <g id="sails" fill="url(#sailGradient)"> <rect x="10" y="5" width="3" height="10" /> <rect x="15" y="5" width="3" height="10" /> <rect x="20" y="7" width="2" height="8" /> <path d="M1 9 h1 v-1 h1 v-1 h1 v-1 h1 v-1 h3 v10 h-3 v-1 h-1 v-1 h-1 v-1 h-1 v-1 h-1 z" /> <path d="M26 10 h1 v1  h1 v1 h1 v1 h1 v1 h1 v1 h-5 z" /> </g> </g>';
string constant SHIP_YACHT = '<g transform="scale(10)"> <g id="border" class="border"> <path d="M1 12 h5 v-1 h2 v-1 h2 v-1 h2 v-1 h2 v-1 h1 v-1 h3 v1 h1 v1 h2 v1 h2 v1 h2 v1 h2 v1 h5 v3 h-2 v1 h-1 v1 h-1 v1 h-1 v1 h-27 v-3 h1 z" /> <g class="flagsBorder"> <path d="M13 5 h5 v3 h-5z" /> </g> </g> <g> <path id="hull" d="M2 13 h 29 v1 h-2 v1 h-1 v1 h-1 v1 h-1 v1 h-25 v-1 h1 v-1 h1 v-1 h1 v-1 h-2 z" class="hull" /> <path id="window-line" d="M2 13 h29 v1 h-2 v1 h-25 v-1 h-2 z" class="windowLine" /> <g id="windows" class="window"> <path d="M9 14 h1 v1 h-1 z" /> <path d="M13 14 h1 v1 h-1 z" /> <path d="M17 14 h1 v1 h-1 z" /> <path d="M21 14 h1 v1 h-1 z" /> <path d="M11 13 h1 v1 h-1 z" /> <path d="M15 13 h1 v1 h-1 z" /> <path d="M19 13 h1 v1 h-1 z" /> <path d="M23 13 h1 v1 h-1 z" /> </g> </g> <g id="masts" class="masts"> <path d="M16.5 7 v1" /> </g> <g id="flags" class="flags flagsBorder"> <path d="M14 6.5 h3" /> </g> <g id="body"> <g class="bodyColor1"> <path d="M7 12 h19 v1 h-19 z" /> <path d="M11 10 h11 v1 h-11 z" /> <path d="M15 8 h3 v1 h-3 z" /> </g> <g class="bodyColor2"> <path d="M9 11 h15 v1 h-15 z" /> <path d="M13 9 h7 v1 h-7 z" /> </g> </g> </g>';

/// @custom:security-contact security@laidback.ventures
contract Punkships is ERC721, ERC721Burnable, Ownable {
    error InvalidPosition(uint8 position);
    event Mint(address indexed owner, uint256 indexed id, string tokenURI);

    uint256 private _nextTokenId;

    mapping (ShipType => uint256[2]) private bitMasks;

    modifier onlyMinted(uint256 tokenId) {
        if (_ownerOf(tokenId) == address(0)) {
            revert ShipNotMinted(tokenId);
        }
        _;
    }

    constructor(
        address initialOwner
    ) ERC721("Punkships", "PNKS") Ownable(initialOwner) {
        // set bitmasks for each ship type
        bitMasks[ShipType.ship1Master] = [16725558901494115785419202518751519294095360, 22126520631778269869533838308493558309511168];
        bitMasks[ShipType.ship3Master] = [4860506217279811509646059063990415761321492480, 90495335133133213900115431374286650994058720240];
        bitMasks[ShipType.ship4Master] = [6048814437193289925617386769605409608971598848, 360006232741571133565032047329048718624112459004];
        bitMasks[ShipType.ship5Master] = [1151013953719605458307710602397234870358351072, 709065859407158377640086230027040835960688581886];
        bitMasks[ShipType.shipYacht] = [0, 0];
    }

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        emit Mint(to, tokenId, tokenURI(tokenId));
    }

    function getByte(
        uint8 position,
        uint256 randomValue
    ) private pure returns (uint8) {
        if (position > 31) {
            revert InvalidPosition(position);
        }
        return uint8(randomValue >> (8 * position));
    }

    function getColor(
        uint8 position,
        uint256 randomValue
    ) private pure returns (Color memory) {
        uint8 r = getByte(position, randomValue);
        uint8 g = getByte(position + 1, randomValue);
        uint8 b = getByte(position + 2, randomValue);
        return Color(r, g, b);
    }

    function createDefs(
        Color memory sailTop,
        Color memory sailBottom,
        Color memory hull,
        Color memory windowLine,
        Color memory window,
        Color memory masts,
        Color memory flags,
        Color memory signet1,
        Color memory signet2,
        Color memory signet3,
        bool flagsPresent
    ) private pure returns (string memory) {
        return
            string.concat(
                "<defs>",
                '<style type="text/css">',
                ".sailTop { stop-color: rgb(", Strings.toString(sailTop.r), ",", Strings.toString(sailTop.g), ",", Strings.toString(sailTop.b), "); }",
                ".sailBottom { stop-color: rgb(", Strings.toString(sailBottom.r), ",", Strings.toString(sailBottom.g), ",", Strings.toString(sailBottom.b), "); }",
                ".bodyColor1 { fill: rgb(", Strings.toString(sailTop.r), ",", Strings.toString(sailTop.g), ",", Strings.toString(sailTop.b), "); }",
                ".bodyColor2 { fill: rgb(", Strings.toString(sailBottom.r), ",", Strings.toString(sailBottom.g), ",", Strings.toString(sailBottom.b), "); }",
                ".hull { fill: rgb(", Strings.toString(hull.r), ",", Strings.toString(hull.g), ",", Strings.toString(hull.b), "); }", 
                ".windowLine { fill: rgb(", Strings.toString(windowLine.r), ",", Strings.toString(windowLine.g), ",", Strings.toString(windowLine.b), "); }",
                ".window { fill: rgb(", Strings.toString(window.r), ",", Strings.toString(window.g), ",", Strings.toString(window.b), "); }",
                ".masts { stroke: rgb(", Strings.toString(masts.r), ",", Strings.toString(masts.g), ",", Strings.toString(masts.b), "); }",
                ".flags { stroke: rgb(", Strings.toString(flags.r), ",", Strings.toString(flags.g), ",", Strings.toString(flags.b), "); }",
                ".signet1 { fill: rgb(", Strings.toString(signet1.r), ",", Strings.toString(signet1.g), ",", Strings.toString(signet1.b), "); }",
                ".signet2 { fill: rgb(", Strings.toString(signet2.r), ",", Strings.toString(signet2.g), ",", Strings.toString(signet2.b), "); }",
                ".signet3 { fill: rgb(", Strings.toString(signet3.r), ",", Strings.toString(signet3.g), ",", Strings.toString(signet3.b), "); }",
                ".flagsBorder { opacity:", flagsPresent ? "1" : "0", "; }",
                ".border { fill: #fff }",
                "</style>",
                '<linearGradient id="sailGradient" gradientTransform="rotate(90)"> <stop offset="5%"  class="sailTop"/> <stop offset="95%" class="sailBottom"/> </linearGradient>',
                "</defs>"
            );
    }

    function createSignetGroup(bool[] memory signets, uint8 rowLength, uint8 shiftX, uint8 shiftY) private pure returns (string memory) {
        string memory signetGroup = '<g id="signets" transform="scale(10)"> <g id="signet1" class="signet1">';
        for (uint16 i = 0; i < signets.length; i++) {
            if (signets[i]) {
                signetGroup = string.concat(
                    signetGroup,
                    '<path d="M',
                    Strings.toString(i % rowLength + shiftX),
                    ' ', 
                    Strings.toString(i / rowLength + shiftY),
                    ' h1 v1 h-1 z" />'
                );
            }
        }
        signetGroup = string.concat(signetGroup, "</g> </g>");
        return signetGroup;
    }

    function createSvg(uint256 tokenId) private view returns (string memory) {
        uint256 random = uint256(keccak256(abi.encodePacked(tokenId)));

        ShipType shipType = _getShipType(tokenId);
        bool flag = getByte(1, random) % 2 > 0 ? true : false;
        Color memory colorHull = getColor(2, random);
        Color memory colorWindowRow = getColor(5, random);
        Color memory colorWindow = getColor(8, random);
        Color memory colorMast = getColor(11, random);
        Color memory colorSail1 = getColor(14, random);
        Color memory colorSail2 = getColor(17, random);
        Color memory colorFlag = getColor(20, random);
        Color memory colorSignet1 = getColor(23, random);
        Color memory colorSignet2 = getColor(26, random);
        Color memory colorSignet3 = getColor(29, random);

        bool[] memory signets = createSignetsV2(shipType, random);

        return createSvg(
            colorSail1,
            colorSail2,
            colorHull,
            colorWindowRow,
            colorWindow,
            colorMast,
            colorFlag,
            colorSignet1,
            colorSignet2,
            colorSignet3,
            flag,
            shipType,
            signets
        );
    }

    function createSvg(
        Color memory sailTop,
        Color memory sailBottom,
        Color memory hull,
        Color memory windowLine,
        Color memory window,
        Color memory masts,
        Color memory flags,
        Color memory signet1,
        Color memory signet2,
        Color memory signet3,
        bool flagsPresent,
        ShipType shipType,
        bool[] memory signets
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    SVG_HEADER,
                    createDefs(
                        sailTop,
                        sailBottom,
                        hull,
                        windowLine,
                        window,
                        masts,
                        flags,
                        signet1,
                        signet2,
                        signet3,
                        flagsPresent
                    ),
                    shipType == ShipType.ship1Master ? SHIP_1MASTER : "",
                    shipType == ShipType.ship3Master ? SHIP_3MASTER : "",
                    shipType == ShipType.ship4Master ? SHIP_4MASTER : "",
                    shipType == ShipType.ship5Master ? SHIP_5MASTER : "",
                    shipType == ShipType.shipYacht ? SHIP_YACHT : "",
                    createSignetGroup(signets, 32, 0, 5),
                    SVG_FOOTER
                )
            );
    }

    function _getImage(uint256 tokenId) private view returns (string memory) {
        return string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(createSvg(tokenId)))
        );
    }

    function getImage(uint256 tokenId) external view onlyMinted(tokenId) returns (string memory) {
        return _getImage(tokenId);
    }

    function createSignetsV2(ShipType shipType, uint256 random) private view returns (bool[] memory) {

        uint256[] memory signets = new uint256[](2);
        
        signets[0] = random & bitMasks[shipType][0];

        signets[1] = uint256(keccak256(abi.encodePacked(random))) & bitMasks[shipType][1];

        // ten rows can be set (rows 5-15), each 32 columns wide
        bool[] memory signetsArray = new bool[](10 * 32);

        for (uint8 i = 0; i < 160; i++) {
            signetsArray[i] = ((signets[0] & (1 << i)) > 0);
        }

        for (uint16 i = 0; i < 160; i++) {
            signetsArray[i + 160] = ((signets[1] & (1 << i)) > 0);
        }
        return signetsArray;
    }

    function _getRange(uint256 tokenId) private pure returns (uint8) {
        uint8[5] memory ranges = [6, 5, 4, 3, 2];

        uint256 random = uint256(keccak256(abi.encodePacked(tokenId)));

        ShipType shipType = ShipType(
            getByte(0, random) % (uint8(type(ShipType).max) + 1)
        );
        return ranges[uint8(shipType)];
    }

    function getRange(uint256 tokenId) external view onlyMinted(tokenId) returns (uint8) {
        return _getRange(tokenId);
    }

    function _getShootingRange(uint256 tokenId) private pure returns (uint8) {
        uint8[5] memory shootingRanges = [2, 3, 4, 5, 6];

        uint256 random = uint256(keccak256(abi.encodePacked(tokenId)));

        ShipType shipType = ShipType(
            getByte(0, random) % (uint8(type(ShipType).max) + 1)
        );
        return shootingRanges[uint8(shipType)];
    }

    function getShootingRange(uint256 tokenId) external view onlyMinted(tokenId) returns (uint8) {
        return _getShootingRange(tokenId);
    }

    function _getShipType(uint256 tokenId) private pure returns (ShipType) {
        uint256 random = uint256(keccak256(abi.encodePacked(tokenId)));
        ShipType shipType = ShipType(
            getByte(0, random) % (uint8(type(ShipType).max) + 1)
        );
        return shipType;
    }

    function _getShipTypeName(uint256 tokenId) private pure returns (string memory) {
        string[5] memory shipNames = [
            "Boat",
            "Sloop",
            "Brig",
            "Frigate",
            "Yacht"
        ];
        return shipNames[uint8(_getShipType(tokenId))];
    }

    function getShipTypeName(uint256 tokenId) public view onlyMinted(tokenId) returns (string memory) {
        return _getShipTypeName(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override onlyMinted(tokenId) returns (string memory) {
        return _tokenURI(tokenId);
    }

    function _tokenURI(
        uint256 tokenId
    ) internal view returns (string memory) {

        // uint256 random = uint256(keccak256(abi.encodePacked(tokenId)));

        // ShipType shipType = _getShipType(tokenId);
        // bool flag = getByte(1, random) % 2 > 0 ? true : false;
        // Color memory colorHull = getColor(2, random);
        // Color memory colorWindowRow = getColor(5, random);
        // Color memory colorWindow = getColor(8, random);
        // Color memory colorMast = getColor(11, random);
        // Color memory colorSail1 = getColor(14, random);
        // Color memory colorSail2 = getColor(17, random);
        // Color memory colorFlag = getColor(20, random);
        // Color memory colorSignet1 = getColor(23, random);
        // Color memory colorSignet2 = getColor(26, random);
        // Color memory colorSignet3 = getColor(29, random);

        // // uint256 signetAllSet = type(uint256).max;

        // // bool[] memory signets = createSignets(random, 7, 7);
        // bool[] memory signets = createSignetsV2(shipType, random);

        // string memory svg = createSvg(
        //     colorSail1,
        //     colorSail2,
        //     colorHull,
        //     colorWindowRow,
        //     colorWindow,
        //     colorMast,
        //     colorFlag,
        //     colorSignet1,
        //     colorSignet2,
        //     colorSignet3,
        //     flag,
        //     shipType,
        //     signets
        // );

        string memory metadataJson = string.concat(
            '{"name": "Punkship #',
            Strings.toString(tokenId),
            '", "description": "Punkships are randomized and unique ships. Use them for the punkship game", "attributes": [{"trait_type": "range", "value": "',
            Strings.toString(_getRange(tokenId)),
            '"}, {"trait_type": "shootingRange", "value": "',
            Strings.toString(_getShootingRange(tokenId)),
            '"}, {"trait_type": "shipType", "value": "',
            _getShipTypeName(tokenId),
            '"}], "image": ,"',
            _getImage(tokenId),
            '"}'
        );

        // console.log("metadata: %s", metadataJson);

        // Base64 encode and create data URI from svg
        string memory metadataBase64Encoded = Base64.encode(
            bytes(metadataJson)
        );
        string memory metadataDataUri = string.concat(
            "data:application/json;base64,",
            metadataBase64Encoded
        );


        return metadataDataUri;
    }
}
