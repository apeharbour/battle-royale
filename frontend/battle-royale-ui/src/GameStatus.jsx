import React, { Fragment } from "react";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAccount } from "wagmi";
import removeYachtBackground from "./RemoveYachtBackground";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function GameStatus({ playerStateDialogOpen, winner, playerState, setPlayerStateDialogOpen }) {
    const navigate = useNavigate();
    const { address } = useAccount();

    const handleClose = () => {
        setPlayerStateDialogOpen(false);
    };

    const isWinner = winner && winner.address && address && address.toLowerCase() === winner.address.toLowerCase();


    return (
        <Fragment>
            <BootstrapDialog
                open={playerStateDialogOpen}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        m: 0, p: 2,
                        color: isWinner ? 'green' : 'red',
                        fontSize: '2rem',
                        fontWeight: 700,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    id="customized-dialog-title"
                >
                    {isWinner ? 'Game Over -> You Won!!' : 'Game Over!!'}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    {winner ? (
                        <>
                            <Box display="flex" alignItems="center">
                                <Box flexGrow={1}>
                                    <Typography variant="h6" gutterBottom>
                                        Winner of this game is: {winner.address} with{' '}
                                        <Typography variant="h6" component="span" sx={{ color: 'red' }}>
                                            {winner.kills}
                                        </Typography>{' '}
                                        kills. Winner ship:
                                    </Typography>
                                </Box>
                                <Box
                                    component="img"
                                    src={removeYachtBackground(winner.image)}
                                    alt="Winner's ship"
                                    sx={{ maxWidth: '10%' }}
                                />
                            </Box>
                            <Divider />
                        </>
                    ) : (null)}
                    {playerState === 'won' && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <Typography variant="h6" gutterBottom>
                                Congratulations! You have won the game.
                            </Typography>
                        </Box>
                    )}
                    {(playerState === 'dropped' || playerState === 'beached' || playerState === 'crashed' || playerState === 'shot') && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <Typography variant="h6" gutterBottom>
                                Unfortunately, you lost the game. No worries, you can always try again!
                            </Typography>
                        </Box>
                    )}
                    {playerState === 'draw' && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <Typography variant="h6" gutterBottom>
                                Uh oh! The game ended in a draw. Better luck next time!
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </BootstrapDialog>
        </Fragment>
    );
}
