import React from 'react';
import { Grid, Button } from '@mui/material';

export default function CenteredButtons() {
    return (
        <Grid 
            container 
            spacing={2}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <Grid 
                item 
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button 
                    variant="contained" 
                    href="/registration"
                    sx={{
                        fontSize: '1rem',
                        padding: '10px 20px',
                        minWidth: '200px'
                    }}
                > 
                    Register 
                </Button>
            </Grid>
            <Grid 
                item 
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button 
                    variant="contained" 
                    href="/listgames"
                    sx={{
                        fontSize: '1rem',
                        padding: '10px 20px',
                        minWidth: '200px'
                    }}
                > 
                    Active Games 
                </Button>
            </Grid>
        </Grid>
    );
}
