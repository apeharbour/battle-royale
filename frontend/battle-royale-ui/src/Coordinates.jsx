import * as React from "react";
import { green, grey, red, yellow } from "@mui/material/colors";
import { Text } from "react-hexgrid";

const fontStyle = { fontWeight: 700, fontSize: "0.1rem" }

export default function Coordinates({
  q,
  r,
  s,
}) {
  return (
    <>
      <Text
        transform={`translate(${-1}, ${-1.4})`}
        style={{...fontStyle, fill: grey[100], stroke: 'none'}}
        >
        {q}
      </Text>
      <Text
        transform={`translate(${-1}, ${1.4})`}
        style={{...fontStyle, fill: green.A700, stroke: 'none' }}
        >
        {s}
      </Text>
      <Text
        transform={`translate(${1.4}, ${0})`}
        style={{...fontStyle, fill: yellow[500], stroke: 'none' }}
      >
        {r}
      </Text>
    </>
  )
}
