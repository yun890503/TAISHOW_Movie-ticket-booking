import { useState, useEffect } from 'react';
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
import ReviewsDetailTableRow from '../reviews-detail-table-row';
import ReviewsDetailTableHead from '../reviews-detail-table-head';
import TableEmptyRows from '../table-empty-rows';
import ReviewsDetailTableToolbar from '../reviews-detail-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export default function ReviewsDetailPage() {
  const { movieId } = useParams();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [title, setTitle] = useState('');

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/review-records/${movieId}`);
        setReviews(response.data.reviewRecordList);
        setTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchReviews();
  }, [movieId]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = reviews.map((review) => review.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    inputData: reviews,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/reviews" style={{ textDecoration: 'underline', color: 'DodgerBlue' }}>
            <Typography variant="h4">評論審閱</Typography>
          </Link>
          <Typography color="#FFFFFF" variant="h5">
            {title}
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Card>
        <ReviewsDetailTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ReviewsDetailTableHead
                order={order}
                orderBy={orderBy}
                rowCount={reviews.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'account', label: '帳號' },
                  { id: 'nickName', label: '暱稱' },
                  { id: 'score', label: '評分' },
                  { id: 'comment', label: '評論內容' },
                  { id: 'reviewDate', label: '評論時間' },
                  { id: 'action', label: '操作' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((review) => (
                    <ReviewsDetailTableRow
                      key={review.id}
                      id={review.id}
                      account={review.account}
                      nickName={review.nickName}
                      score={review.score}
                      comment={review.comment}
                      reviewDate={review.reviewDate}
                      isReport={review.isReport}
                      selected={selected.indexOf(review.id) !== -1}
                      handleClick={(event) => handleClick(event, review.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, reviews.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={reviews.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
