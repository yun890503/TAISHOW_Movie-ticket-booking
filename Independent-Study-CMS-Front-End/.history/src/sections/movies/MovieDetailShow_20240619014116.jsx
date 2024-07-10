import { Modal, Box, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    maxHeight: 650,
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    color: '#FF5809',
    padding: 6,
  
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
                            <div>電影名稱: {movie.title}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>訂單編號: {payment.orderNum}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>交易金額: {payment.totalAmount}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>紅利點數: {payment.bonus}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>電影名稱: {payment.title}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>上映日期: {payment.showtime}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>電影票號: {payment.ticketId}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>票種: {payment.ticketType}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>座位編號: {payment.seatNote}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>售票單價: {payment.uniPrice}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>座位排號: {payment.rowNumber}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>座位列號: {payment.seatNumber}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>付款方式: {payment.payway}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>付款狀態: {payment.payStatus}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>付款時間: {payment.payTime}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>修改時間: {payment.modifyTime}</div>
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'><img src={payment.qrcode} alt="" /></Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} key={key}>
                        <Typography variant='body1'>
                            <div>訂購筆數: {`${key+1}`} </div>
                        </Typography>
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