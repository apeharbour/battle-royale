import { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExploreIcon from "@mui/icons-material/Explore";
import deployed_addresses from "./contract-deployment/deployed_addresses.json";
import YartPngDialog from "./YartPngDialog";
import { Box } from "@mui/material";
import SvgImage from "./SvgImage";

const YARTS_ADDRESS = deployed_addresses["Yarts"];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function YartDialog({ open, onClose, nft }) {
  const [pngDialogOpen, setPngDialogOpen] = useState(false);
  const handleClose = () => {
    onClose();
  };

  const handleCardClick = (nft) => {
    setPngDialogOpen(true);
  };

  if (!nft) {
    return null;
  }

  return (
    <BootstrapDialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Stack direction="row" spacing={1}>
          <Typography gutterBottom variant="h5" component="div">
            yart #{nft.tokenId}
          </Typography>
          <ExploreIcon
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://apechain.calderaexplorer.xyz/token/0x53792e6562F0823060BD016cC75F7B2997721143/instance/${nft.tokenId}`,
                "_blank"
              );
            }}
            sx={{ cursor: "pointer", fontSize: "1rem" }}
            fontSize="small"
          />
        </Stack>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <SvgImage
          image={nft.image}
          alt={`yart #${nft.tokenId}`}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            cursor: "pointer",
          }}
          onClick={() => handleCardClick(nft)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            textTransform: "none",
          }}
          onClick={() => handleCardClick(nft)}
        >
          png generator
        </Button>
      </DialogActions>
      <YartPngDialog
        open={pngDialogOpen}
        onClose={() => setPngDialogOpen(false)}
        nft={nft}
      />
    </BootstrapDialog>
  );
}
