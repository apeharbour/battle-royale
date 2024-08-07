import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useAccount } from "wagmi";

export default function Homepage() {
    const [walletConnected, setWalletConnected] = useState(false);
    const navigate = useNavigate();
    const { address } = useAccount();

    useEffect(() => {
        if (walletConnected) {
            navigate('/registration');
        }
    }, [walletConnected, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <Typography variant="h1" component="h1" gutterBottom>
                Welcome to APH Battle Royale!
            </Typography>
            <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                    if (isConnected && !walletConnected) {
                        setWalletConnected(true);
                    }

                    return (
                        <Button variant="contained" onClick={show}>
                            {isConnected ? "Connected": "Connect"}
                        </Button>
                    );
                }}
            </ConnectKitButton.Custom>
        </Box>
    );
}
