import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            p: 2, // Add padding to ensure content spacing
          }}
        >
          <Typography variant="h6" paragraph>
            暫無資料
          </Typography>

          <Typography variant="body2">
            未找到&nbsp;
            <strong>&quot;{query}&quot;</strong>&nbsp;的結果。
            <br /> 請嘗試檢查拼字錯誤或使用完整的單字。
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
