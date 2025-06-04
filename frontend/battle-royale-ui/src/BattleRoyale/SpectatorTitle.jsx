import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { styled } from "@mui/material/styles";


const StyledCardContent = styled(CardContent)(({ theme }) => ({
  height: "calc(100% - 64px)",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "0.5rem",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper,
  },
  textAlign: "left",
}));

export default function SpectatorTitle() {

  return (
    <Card elevation={4} sx={{ overflow: "hidden" }}>
        <CardHeader
          title="spectator mode"
          titleTypographyProps={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color:  "green",
          }}
        />
    </Card>
  );
}
