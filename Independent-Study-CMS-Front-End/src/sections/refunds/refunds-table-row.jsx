import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function RefundTableRow({
  orderNum,
  account,
  totalAmount,
  bonus,
  payway,
  payStatus,
  selected,
  handleClick,
  onRowClick,
}) {
  const handleDetailClick = (event) => {
    event.stopPropagation();
    onRowClick(orderNum);
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const formattedTotalAmount =
    totalAmount !== 0 ? (
      <Typography variant="subtitle2" noWrap sx={{ color: 'red' }}>
        -{formatNumber(totalAmount)}
      </Typography>
    ) : (
      <Typography variant="subtitle2" noWrap>
        {formatNumber(totalAmount)}
      </Typography>
    );

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

  return (
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

      <TableCell sx={{ pointerEvents: 'none' }}>{formattedTotalAmount}</TableCell>

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
    </TableRow>
  );
}

RefundTableRow.propTypes = {
  orderNum: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  totalAmount: PropTypes.number.isRequired,
  bonus: PropTypes.number.isRequired,
  payway: PropTypes.string,
  payStatus: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};
