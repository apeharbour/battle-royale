import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import {Box, Button, Card, CardContent, CardMedia, Grid, Stack, Typography} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const GenesisYachts = ({ playerData }) => {

    const [yachts, setYachts] = useState([])
    const [selectedYacht, setSelectedYacht] = useState(null)
    const [revealYachtData, setRevealYachtData] = useState(false)
    const [yachtData, setYachtData] = useState(null)

    useEffect(() => {
        axios.get('https://m59jtciqre.execute-api.us-east-1.amazonaws.com/getGenesisNfts', {
          params:{ address: playerData.playerAddress
          },
         })
         .then(({data}) => {
           // Handle the response data
           setYachts(data);
           console.log('Genesis Data:', data)
         }).catch((error) => {
           // Handle errors
           console.error(error);
         });
      }, [playerData.playerAddress])

      console.log('Selected yachts:', selectedYacht)

      const yachtDetail = async () => {
        if(playerData.contractInstance) {
            const tx = await playerData.contractInstance.requestAPIdata(selectedYacht, playerData.playerAddress, playerData.playerAddress)
            await tx.wait()
        }
      }

      const yachtDetailDisplay = async () => {
        
        try {
            const data = await playerData.contractInstance.nftDataMapping(playerData.playerAddress)
            setYachtData(data)
            console.log('Yacht Data:', data)
        } catch (error) {
            console.error("Error fetching NFT data:", error);
        }
        setRevealYachtData(!revealYachtData)
}

      return(
        <Fragment>
            {yachts && yachts.map((yacht, index) => {
                 const ipfsUrl = yacht.metadata && yacht.metadata.image;
                 const httpUrl = ipfsUrl 
                     ? ipfsUrl.replace(
                         "ipfs://", 
                         "https://apeharbour.mypinata.cloud/ipfs/"
                       ) + "?pinataGatewayToken=DpUkFkY4XM34Nwun1APLX8jozT9nY5J-DAxq5tK141A-BczLnktEeq7GaPAbwTDF"
                     : null;

                 return(
                    <Card  
                    key={yacht.tokenId} 
                    sx={{ 
                        display: 'flex', 
                        border: selectedYacht === yacht.tokenId ? '2px solid blue' : 'none' 
                    }}  
                    onClick={() => setSelectedYacht(yacht.tokenId)}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: 151 }}
                        image={httpUrl}
                        alt={yacht.tokenId}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {yacht.metadata.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {yacht.tokenId}
                            </Typography>
                            {selectedYacht === yacht.tokenId && (
                       
                       <CheckCircleIcon color="#0000FF" />
                  
               )}
                        </CardContent>
                    </Box>
                </Card>
                
                 )    
            })}

            <Stack spacing={2}>
                <Button variant='contained' onClick={yachtDetail}> Select </Button>
                <Button variant='contained' onClick={yachtDetailDisplay}>Yacht Detail</Button>
            </Stack>
                {yachtData && (
                     <Grid item xs={4}>
                    <Typography variant='body1'>Yacht token Id: {yachtData.tokenId}</Typography>
                    <Typography variant='body1'>Yacht speed: {yachtData.speed.toString()}</Typography>
                    <Typography variant='body1'>Yacht range: {yachtData.range.toString()}</Typography>
                    </Grid>
                )}
           
        </Fragment>
      )      
}

export default GenesisYachts