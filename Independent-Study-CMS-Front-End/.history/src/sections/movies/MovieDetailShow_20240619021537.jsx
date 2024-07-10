import { Modal, Box, Typography, Grid, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    maxHeight: 650,
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    // p: 4,
    color: '#FF5809',
    // padding: 6,
  
    '&::-webkit-scrollbar': {
      width: 7,
    },
    '&::-webkit-scrollbar-button': {
      background: 'transparent',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-track-piece': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid slategrey',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'transparent',
    },
  };

const MovieDetailShow = ({ show, onHide, data}) => {
    return(
        <Modal
            open={show}
            onClose={onHide}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ fontFamily: 'LXGW WenKai TC', fontWeight: 'bold', color: '#fff' }}>電影詳細資訊
                </Typography>
                {data && (
                <Grid container spacing={2} sx={{ mt: 2}}>
                    {data.map((movie, key) => (
                    <>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <img src={movie.poster} alt="" />
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                            <Grid item xs={12} sm={6} key={key}>
                            <Typography variant='body1'>
                                <div>電影名稱: {movie.title}</div>
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} key={key}>
                            <Typography variant='body1'>
                                <div>電影片長: {movie.runtime}</div>
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} key={key}>
                            <Typography variant='body1'>
                                <div>電影類型: {movie.genre}</div>
                            </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} key={key}>
                            <Typography variant='body1'>
                                <div>上映日期: {movie.releaseDate}</div>
                            </Typography>
                            </Grid>
                        </Grid>
                        
                    </>
                    
                    ))}
                </Grid>
                )}
                <Button onClick={onHide}>Close</Button>
            </Box>
        </Modal>
    )
}

export default MovieDetailShow