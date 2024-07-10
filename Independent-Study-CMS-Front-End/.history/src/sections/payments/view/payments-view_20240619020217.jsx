import { useEffect, useState } from 'react';
import axios from 'axios';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Iconify from 'src/components/iconify';
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
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 仍然是一個Array資料結構 => useState([])
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 執行Post請求 => 將return的值放入變數data
      const data = await fetchPayments();
      // data傳入 getPayments做屬性映射
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
      const newSelecteds = paymentData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  // 父層取得資料並show出畫面
  const [detailShow, setDetailShow] = useState(false);
  const [detailData, setDetailData] = useState('');
  const PAYMENT_URL = 'http://localhost:8080/orders/getOrders';
  const handleRowClick = async (orderNum) => {
    const res = await axios.get(`${PAYMENT_URL}/${orderNum}`)
    console.log(res.data);
    setDetailData(res.data);
    setDetailShow(true);
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">購買記錄</Typography>

        <Button variant="contained" color="inherit" 
          onClick={() => {}}
          startIcon={<Iconify icon="eva:plus-fill" />}>
          變更付款
        </Button>
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
                  { id: 'userName', label: '會員' },
                  { id: 'totalAmount', label: '交易金額' },
                  { id: 'bonus', label: '紅利點數' },
                  { id: 'payway', label: '付款方式' },
                  { id: 'payStatus', label: '付款狀態' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  // 根據 row.屬性名稱 放入TableRow
                  // key={row.id}存在可以作為事件選擇標的
                  // <PaymentTableRow> 具有以下多種屬性及方法
                  .map((row) => (
                    <PaymentTableRow
                      key={row.id}
                      orderNum={row.orderNum}
                      userName={row.userName}
                      totalAmount={row.totalAmount}
                      bonus={row.bonus}
                      payway={row.payway}
                      payStatus={row.payStatus}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      onRowClick={handleRowClick}
                    />
                  ))
                }

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, paymentData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>

              {detailShow && (
                <DetailWindow
                  show = {detailShow}
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
