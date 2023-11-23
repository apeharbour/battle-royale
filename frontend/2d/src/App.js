import React, { useState } from 'react'
import './App.css'
import { Button, Container, Grid, Stack, Tooltip, Typography } from '@mui/material'
import GameModeWT from './GameModeWT'
import GameModeWOT from './GameModeWOT'
import GameModeNP from './GameModeNP'
import GameModePunk from './GameModePunk'
import RegistrationPunk from './RegistrationPunk'

function App() {
  const [gameMode, setGameMode] = useState(null)

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h3'>Select Game Mode</Typography>
          <Stack spacing={2} direction='row'>
            <Tooltip title='Register your self for the Battle Royale - mode Punk Ships'>
              <Button
                variant='outlined'
                onClick={() => {
                  if (gameMode === 'registration') {
                    setGameMode(null)
                  } else {
                    setGameMode('registration')
                  }
                }}
              >
                Register for the Game
              </Button>
            </Tooltip>
            {/* <Tooltip title='Game mode which depends upon the speed and range of the yachts'>
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
              <Button
                variant='outlined'
                onClick={() => {
                  if (gameMode === 'gameModeNP') {
                    setGameMode(null)
                  } else {
                    setGameMode('gameModeNP')
                  }
                }}
              >
                Game mode with probability mechanics
              </Button>
            </Tooltip> */}
            <Tooltip title='Game mode with new punk ships'>
              <Button
                variant='outlined'
                onClick={() => {
                  if (gameMode === 'gameModePunk') {
                    setGameMode(null)
                  } else {
                    setGameMode('gameModePunk')
                  }
                }}
              >
                Game mode with new Punk ships
              </Button>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      {gameMode === 'registration' && <RegistrationPunk />}
      {gameMode === 'gameModeWT' && <GameModeWT />}
      {gameMode === 'gameModeWOT' && <GameModeWOT />}
      {gameMode === 'gameModeNP' && <GameModeNP />}
      {gameMode === 'gameModePunk' && <GameModePunk />}
    </Container>
  )
}

export default App
