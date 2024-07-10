import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import dayjs from 'dayjs';

const PaymentTableRow = ({
  orderNum,
  account,
  totalAmount,
  bonus,
  payway,
  payStatus,
  showTime,
  refunded,
  selected,
  handleClick,
  onRowClick,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDetailClick = (event) => {
    event.stopPropagation();
    onRowClick(orderNum);
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const formattedBonus =
    bonus < 0 ? (
      <Typography variant="subtitle2" noWrap sx={{ color: 'red' }}>
        {formatNumber(bonus)}
      </Typography>
    ) : (
      <Typography variant="subtitle2" noWrap>
        {formatNumber(bonus)}
      </Typography>
    );

  const validShowTime = showTime ? dayjs(showTime) : null;

  const isRefundable =
    !refunded &&
    (payStatus === '完成' || payStatus === '不需付款') &&
    validShowTime &&
    dayjs().isBefore(validShowTime.subtract(30, 'minute'));

  const handleRefund = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8080/payment-records/${orderNum}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      alert('退款單已送出');
      window.location.reload();
    }
  };

  return (
    <>
      <TableRow hover={false} tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={(event) => handleClick(event, orderNum)}
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ cursor: 'pointer', color: 'DodgerBlue', textDecoration: 'underline' }}
            onClick={handleDetailClick}
          >
            {orderNum}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {account}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {formatNumber(totalAmount)}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>{formattedBonus}</TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {payway || '-'}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {payStatus}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefund}
            disabled={!isRefundable}
          >
            退款
          </Button>
        </TableCell>
      </TableRow>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

PaymentTableRow.propTypes = {
  orderNum: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  totalAmount: PropTypes.number.isRequired,
  bonus: PropTypes.number.isRequired,
  payway: PropTypes.string,
  payStatus: PropTypes.string.isRequired,
  showTime: PropTypes.string,
  refunded: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default PaymentTableRow;
