import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

const style = (theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 680,
  maxHeight: 650,
  overflowY: 'auto',
  bgcolor: alpha('#708090', 1),
  borderRadius: '10px',
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
});

const formatNumber = (number) => {
  return number.toLocaleString();
};

const DetailWindow = ({ show, onHide, data }) => {
  return (
    <Modal
      open={show}
      onClose={onHide}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontFamily: 'LXGW WenKai TC',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          訂單詳情
        </Typography>
        {data && (
          <TableContainer component={Paper}>
            <Table aria-label="purchase details">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>訂單編號</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.orderNum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>會員帳號</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.account}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>交易金額</TableCell>
                  <TableCell
                    sx={{ color: data.totalAmount !== 0 ? 'red' : '#fff', whiteSpace: 'nowrap' }}
                  >
                    {data.totalAmount !== 0
                      ? `-${formatNumber(data.totalAmount)}`
                      : formatNumber(data.totalAmount)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>紅利點數</TableCell>
                  <TableCell sx={{ color: data.bonus < 0 ? 'red' : '#fff', whiteSpace: 'nowrap' }}>
                    {formatNumber(data.bonus)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>電影名稱</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>上映日期</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.showTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>票數</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.ticketDetailList.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontFamily: 'LXGW WenKai TC',
                fontWeight: 'bold',
                color: '#fff',
                mt: 4,
                textAlign: 'center',
              }}
            >
              票種詳情
            </Typography>
            <Table aria-label="ticket details">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>票種</TableCell>
                  <TableCell sx={{ color: '#fff' }}>座位</TableCell>
                  <TableCell sx={{ color: '#fff' }}>售價</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.ticketDetailList.map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#fff' }}>{ticket.ticketType}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {ticket.rowNum}排{ticket.seatNum}號
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>{ticket.unitPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontFamily: 'LXGW WenKai TC',
                fontWeight: 'bold',
                color: '#fff',
                mt: 4,
                textAlign: 'center',
              }}
            >
              退款詳情
            </Typography>
            <Table aria-label="additional details">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>退款方式</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.payway || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>退款狀態</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.payStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>退款時間</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.payTime || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>最後修改時間</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{data.modifyTime}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={onHide}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DetailWindow;
