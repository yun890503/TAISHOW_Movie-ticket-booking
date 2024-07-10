import { useEffect, useState } from 'react';
import axios from 'axios';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import PaymentTableRow from '../payments-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import { fetchPayments, getPayments } from 'src/_mock/Payments';
import DetailWindow from './DetailWinow';

export default function PaymentsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPayments();
      setPaymentData(getPayments(data));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = paymentData.map((n) => n.orderNum);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, orderNum) => {
    const selectedIndex = selected.indexOf(orderNum);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, orderNum);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: paymentData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const [detailShow, setDetailShow] = useState(false);
  const [detailData, setDetailData] = useState('');
  const PAYMENT_URL = 'http://localhost:8080/payment-records';
  const handleRowClick = async (orderNum) => {
    const res = await axios.get(`${PAYMENT_URL}/${orderNum}`);
    setDetailData(res.data);
    setDetailShow(true);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">購票記錄</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={paymentData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'orderNum', label: '訂單編號' },
                  { id: 'account', label: '會員' },
                  { id: 'totalAmount', label: '交易金額' },
                  { id: 'bonus', label: '紅利點數' },
                  { id: 'payway', label: '付款方式' },
                  { id: 'payStatus', label: '付款狀態' },
                  { id: 'actions', label: '操作', align: 'center' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PaymentTableRow
                      key={row.orderNum}
                      orderNum={row.orderNum}
                      account={row.account}
                      totalAmount={row.totalAmount}
                      bonus={row.bonus}
                      payway={row.payway}
                      payStatus={row.payStatus}
                      showTime={row.showTime}
                      refunded={row.refunded}
                      selected={selected.indexOf(row.orderNum) !== -1}
                      handleClick={(event) => handleClick(event, row.orderNum)}
                      onRowClick={handleRowClick}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, paymentData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>

              {detailShow && (
                <DetailWindow
                  show={detailShow}
                  onHide={() => setDetailShow(false)}
                  state="showing"
                  data={detailData}
                />
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={paymentData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
