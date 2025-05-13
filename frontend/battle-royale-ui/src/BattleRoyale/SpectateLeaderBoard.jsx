import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import removeYachtBackground from "./RemoveYachtBackground";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

export default function SpectateLeaderBoard({ ships }) {
  return (
    <Card>
      <CardHeader title="leaderboard" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>image</TableCell>
              <TableCell>address</TableCell>
              <TableCell align="center">movement range</TableCell>
              <TableCell align="center">shot range</TableCell>
              <TableCell align="center">current position</TableCell>
              <TableCell align="center">state</TableCell>
              <TableCell align="center">kills</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ships && ships.map((ship) => (
              <TableRow
                key={ship.address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <img
                    src={removeYachtBackground(ship.image)}
                    alt="Ship"
                    style={{ width: "50px", height: "50px" }}
                  />
                </TableCell>
                <TableCell>{shortenAddress(ship.address)}</TableCell>
                <TableCell align="center">{ship.range}</TableCell>
                <TableCell align="center">{ship.shotRange}</TableCell>
                <TableCell align="center">
                  {ship.state === "active" ? `${ship.q},${ship.r}` : "--"}
                </TableCell>
                <TableCell align="center">{ship.state}</TableCell>
                <TableCell align="center">{ship.kills}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
