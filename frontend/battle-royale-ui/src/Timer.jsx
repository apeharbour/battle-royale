import React,{ useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ShipPaper = styled(Paper)({
    maxWidth: '240px',
    borderRadius: '30px',
    overflow: 'hidden',
    margin: 'auto auto 40px auto', 
    backgroundColor: 'rgba(195, 208, 243, 0.5)'

  });

  const TopSection = styled('div')({
    backgroundColor: 'rgba(195, 208, 243, 0.5)',
    padding: '16px',
  });

  const BottomSection = styled('div')({
    backgroundColor: 'rgba(215, 227, 249, 0.5)',
    padding: '16px',
  });

export default function Timer(props) {

    const [timeLeft, setTimeLeft] = useState('');
    console.log('Timer gameid', props.gameId);

    useEffect(() => {
        const fetchTimer = async () => {
          const url = `https://0fci0zsi30.execute-api.eu-north-1.amazonaws.com/prod/fetchTimer?gameId=${props.gameId}`;
          try {
            const response = await fetch(url);
            const data = await response.json();
            updateCountdown(data.nextUpdateTime);
            console.log('Timer:', data.nextUpdateTime);
          } catch (error) {
            console.error('Error fetching timer:', error);
          }
        };
    
        fetchTimer();
    
        // Update the countdown every second
        const interval = setInterval(() => {
          fetchTimer();
        }, 1000);
    
        return () => clearInterval(interval);
      }, [props.gameId]);

      const updateCountdown = (nextUpdateTime) => {
        const endTime = new Date(nextUpdateTime).getTime();
        const now = new Date().getTime();
        const distance = endTime - now;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        if (distance < 0) {
          setTimeLeft("EXPIRED");
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      };

    return (
        <ShipPaper elevation={4}>
        <TopSection>
          <Typography variant="h6" color="black" sx={{ fontWeight: '700' }}>
           Next Move Timer
          </Typography>
        </TopSection>
        <BottomSection sx={{ borderTopLeftRadius: '35px', borderTopRightRadius: '35px'}}>
        <Typography color="red" sx={{ fontWeight: '400'}}>{timeLeft}</Typography>
        </BottomSection>
      </ShipPaper>
    );
}