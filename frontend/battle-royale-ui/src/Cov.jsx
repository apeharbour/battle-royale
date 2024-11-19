import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function Cov() {
  const { gameId } = useParams();
  const [svgData, setSvgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch SVG data
    const fetchSvg = async () => {
      const apiEndpoint = `https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/fetchSvg`;
      const postData = {
        gameId: gameId.toString(),
      };

      try {
        console.log("Fetching SVG for Game ID:", gameId);
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch SVG: ${response.status} ${response.statusText}`
          );
        }

        const svgText = await response.text();
        setSvgData(svgText);
        console.log("SVG fetched successfully for Game ID:", gameId);
      } catch (err) {
        console.error("API Call Error for Game ID:", gameId, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function when the component mounts or gameId changes
    fetchSvg();
  }, [gameId]);

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item size={12}>
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: "600", textAlign: "center" }}
        >
          Canvas Of Victory for Game #{gameId}
        </Typography>
      </Grid>
      <Grid item size={12}>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && svgData && (
          <div
            dangerouslySetInnerHTML={{ __html: svgData }}
            style={{ textAlign: "center" }}
          />
        )}
      </Grid>
    </Grid>
  );
}
