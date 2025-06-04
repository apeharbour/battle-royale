import * as React from "react";
import { useState, useLayoutEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { removeSvgBackground } from "./svgUtil.js";
import ExploreIcon from "@mui/icons-material/Explore";

export default function YartPngDialog({ open, onClose, nft }) {
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("1k");
  const [pngUrl, setPngUrl] = useState(null);

  const handleClose = () => {
    onClose();
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const colorHexMap = {
    black: "#202424",
    melon: "#FFAFAD",
    "blue-gray": "#6094D4",
    peach: "#FFE2B8",
    ivory: "#F9FFF0",
    "columbia blue": "#C1E3E8",
    purple: "#e1d4fa",
    olive: "#A5A67E",
    transparent: "transparent",
  };

  const handleDownload = () => {
    if (nft && nft.image) {
      fetch(nft.image)
        .then((response) => response.text())
        .then((svgText) => {
          // Remove the background from the SVG
          const modifiedSvgText = removeSvgBackground(svgText);

          const sizeMap = {
            "1k": 1000,
            "2k": 2000,
            "3k": 3000,
            "4k": 4000,
            "8k": 8000,
          };
          const dimension = sizeMap[selectedSize] || 1000;
          const colorHex = colorHexMap[selectedColor] || "#000000";

          generatePngUrl(modifiedSvgText, colorHex, dimension, dimension).then(
            (downloadPngUrl) => {
              const link = document.createElement("a");
              link.download = `yart_${nft.tokenId}_${selectedSize}.png`;
              link.href = downloadPngUrl;
              link.click();
            }
          );
        });
    }
  };

  const generatePngUrl = (svgText, backgroundColor, width, height) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const svgBlob = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8",
      });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;

        if (backgroundColor !== "transparent") {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const scaleFactor = 1;
        const imgWidth = canvas.width * scaleFactor;
        const imgHeight = canvas.height * (scaleFactor / 1);
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;

        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        const pngUrl = canvas.toDataURL("image/png");
        resolve(pngUrl);

        DOMURL.revokeObjectURL(url);
      };
      img.onerror = (e) => {
        console.error("Image load error", e);
        resolve(null);
        DOMURL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  useLayoutEffect(() => {
    if (nft && nft.image) {
      fetch(nft.image)
        .then((response) => response.text())
        .then((svgText) => {
          // Remove the background from the SVG
          const modifiedSvgText = removeSvgBackground(svgText);

          const colorHex = colorHexMap[selectedColor] || "#202424";
          generatePngUrl(modifiedSvgText, colorHex, 1000, 1000).then((url) => {
            setPngUrl(url);
          });
        });
    }
  }, [nft, selectedColor]);

  if (!nft) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {" "}
        yart #{nft.tokenId}
        <ExploreIcon
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://apechain.calderaexplorer.xyz/token/0x53792e6562F0823060BD016cC75F7B2997721143/instance/${nft.tokenId}`,
              "_blank"
            );
          }}
          sx={{ cursor: "pointer", fontSize: "1rem", marginLeft: "8px" }}
          fontSize="small"
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={6}>
            {pngUrl ? (
              <img
                src={pngUrl}
                alt={`yart #${nft.tokenId}`}
                style={{ width: "80%", border: "1px solid black" }}
              />
            ) : (
              <div>Loading...</div>
            )}
          </Grid>
          <Grid size={6}>
            <div style={{ marginBottom: "16px" }}>
              <div>color:</div>
              <RadioGroup
                value={selectedColor}
                onChange={handleColorChange}
                aria-label="background color"
                row
              >
                {[
                  { name: "black", hex: "#202424" },
                  { name: "melon", hex: "#FFAFAD" },
                  { name: "blue-gray", hex: "#6094D4" },
                  { name: "peach", hex: "#FFE2B8" },
                  { name: "ivory", hex: "#F9FFF0" },
                  { name: "columbia blue", hex: "#C1E3E8" },
                  { name: "purple", hex: "#e1d4fa" },
                  { name: "olive", hex: "#A5A67E" },
                  { name: "transparent", hex: "transparent" },
                ].map(({ name, hex }) => (
                  <Tooltip title={name} key={name}>
                    <FormControlLabel
                      value={name}
                      control={
                        <Radio
                          sx={{
                            color: hex === "transparent" ? "#D3D3D3" : hex,
                            "&.Mui-checked": {
                              color: hex === "transparent" ? "#D3D3D3" : hex,
                            },
                          }}
                        />
                      }
                    />
                  </Tooltip>
                ))}
              </RadioGroup>
            </div>
            <div>
              <div>size:</div>
              <RadioGroup
                value={selectedSize}
                onChange={handleSizeChange}
                aria-label="image size"
                row
              >
                <FormControlLabel
                  value="1k"
                  control={<Radio />}
                  label="1k x 1k"
                />
                <FormControlLabel
                  value="2k"
                  control={<Radio />}
                  label="2k x 2k"
                />
                <FormControlLabel
                  value="3k"
                  control={<Radio />}
                  label="3k x 3k"
                />
                <FormControlLabel
                  value="4k"
                  control={<Radio />}
                  label="4k x 4k"
                />
                <FormControlLabel
                  value="8k"
                  control={<Radio />}
                  label="8k x 8k"
                />
              </RadioGroup>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            textTransform: "none",
          }}
          onClick={handleClose}
        >
          close
        </Button>
        <Button
          sx={{
            color: "text.secondary",
            fontSize: "1rem",
            textTransform: "none",
          }}
          onClick={handleDownload}
        >
          download
        </Button>
      </DialogActions>
    </Dialog>
  );
}
