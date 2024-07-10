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

const DetailWindow = ({ show, onHide, data }) => {
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

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
            color: '#ccc',
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
                  <TableCell sx={{ color: '#ccc' }}>訂單編號</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.orderNum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>建立時間</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.orderDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>會員帳號</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.account}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>交易金額</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.totalAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>紅利點數</TableCell>
                  <TableCell sx={{ color: data.bonus < 0 ? 'red' : '#ccc', whiteSpace: 'nowrap' }}>
                    {formatNumber(data.bonus)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>電影名稱</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>上映日期</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.showTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>票數</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.ticketDetailList.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontFamily: 'LXGW WenKai TC',
                fontWeight: 'bold',
                color: '#ccc',
                mt: 4,
                textAlign: 'center',
              }}
            >
              票種詳情
            </Typography>
            <Table aria-label="ticket details">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>票種</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>座位</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>售價</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.ticketDetailList.map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#ccc' }}>{ticket.ticketType}</TableCell>
                    <TableCell sx={{ color: '#ccc' }}>
                      {ticket.rowNum}排{ticket.seatNum}號
                    </TableCell>
                    <TableCell sx={{ color: '#ccc' }}>{ticket.unitPrice}</TableCell>
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
                color: '#ccc',
                mt: 4,
                textAlign: 'center',
              }}
            >
              付款詳情
            </Typography>
            <Table aria-label="additional details">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>付款方式</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.payway || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>付款狀態</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.payStatus}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>付款時間</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.payTime || '-'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>最後修改時間</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{data.modifyTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: '#ccc' }}>QR-Code</TableCell>
                  <TableCell>
                    <img src={data.qrcode} alt="QR Code" style={{ width: 150, height: 150 }} />
                  </TableCell>
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
