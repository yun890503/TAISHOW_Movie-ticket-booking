import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useState } from 'react';

export default function ReviewsDetailTableRow({
  id,
  account,
  nickName,
  score,
  comment,
  reviewDate,
  isReport,
  selected,
  handleClick,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/review-records/${id}`);
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <TableRow
        hover={false}
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        style={{ backgroundColor: isReport ? 'red' : 'inherit' }}
      >
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={(event) => handleClick(event, id)} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none" sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {account}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {nickName}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {score}
          </Typography>
        </TableCell>

        <TableCell onClick={handleClickOpen}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              textDecoration: 'underline',
              color: 'DodgerBlue',
              cursor: 'pointer',
              '&:hover': {
                color: '#FF5809',
              },
            }}
          >
            {comment.length > 30 ? `${comment.substring(0, 20)}...` : comment}
          </Typography>
        </TableCell>

        <TableCell sx={{ pointerEvents: 'none' }}>
          <Typography variant="subtitle2" noWrap>
            {reviewDate}
          </Typography>
        </TableCell>

        <TableCell>
          <Button variant="contained" color="primary" onClick={handleDelete}>
            刪除
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#708090' } }}>
        <DialogTitle sx={{ color: '#FFFFFF', typography: 'h4' }}>完整評論內容</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
            <strong>帳號:</strong> {account}
          </DialogContentText>
          <DialogContentText sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
            <strong>暱稱:</strong> {nickName}
          </DialogContentText>
          <DialogContentText sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
            <strong>評分:</strong> {score}
          </DialogContentText>
          <DialogContentText sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
            <strong>評論時間:</strong> {reviewDate}
          </DialogContentText>
          <DialogContentText sx={{ color: '#FFFFFF', lineHeight: 1.6 }}>
            <strong>評論內容:</strong> {comment}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

ReviewsDetailTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  account: PropTypes.string,
  nickName: PropTypes.string,
  score: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  reviewDate: PropTypes.string.isRequired,
  isReport: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};
