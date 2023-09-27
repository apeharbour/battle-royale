import React, { useState } from 'react'
import './App.css'
import { Button, Container, Grid, Stack, Tooltip, Typography } from '@mui/material'
import GameModeWT from './GameModeWT'
import GameModeWOT from './GameModeWOT'
import GameModeNP from './GameModeNP'

function App() {
  const [gameMode, setGameMode] = useState(null)

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h3'>Select Game Mode</Typography>
          <Stack spacing={2} direction='row'>
            <Tooltip title='Game mode which depends upon the speed and range of the yachts'>
              <Button
                variant='outlined'
                onClick={() => {
                  if (gameMode === 'gameModeWT') {
                    setGameMode(null)
                  } else {
                    setGameMode('gameModeWT')
                  }
                }}
              >
                Game Mode with traits
              </Button>
            </Tooltip>
            <Tooltip title='Game mode which does not depends upon the traits of the yachts '>
              <Button
                variant='outlined'
                onClick={() => {
                  if (gameMode === 'gameModeWOT') {
                    setGameMode(null)
                  } else {
                    setGameMode('gameModeWOT')
                  }
                }}
              >
                Game Mode w/o traits
              </Button>
            </Tooltip>
            <Tooltip title='Game mode with new probability mechanics'>
                <Button variant='outlined' onClick={() => {
                  if (gameMode === 'gameModeNP') {
                    setGameMode(null)
                  } else {
                    setGameMode('gameModeNP')
                  }
                }}>
                  Game mode with probability mechanics
                </Button>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      {gameMode === 'gameModeWT' && <GameModeWT />}
      {gameMode === 'gameModeWOT' && <GameModeWOT />}
      {gameMode === 'gameModeNP' && <GameModeNP />}
    </Container>
  )
}

export default App
