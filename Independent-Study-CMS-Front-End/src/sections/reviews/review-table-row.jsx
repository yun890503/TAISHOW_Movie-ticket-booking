import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Label from 'src/components/label';
import { Link } from 'react-router-dom';

const ratingColors = {
  限制級: '#DC3545',
  輔導級: '#FFC107',
  保護級: '#FFC107',
  普遍級: '#0D6EFD',
  default: '#C0C0C0',
};

export default function ReviewTableRow({
  id,
  title,
  genre,
  rating,
  runtime,
  releaseDate,
  language,
  poster,
  selected,
  handleClick,
  onRowClick,
}) {
  const handleDetailClick = (event) => {
    event.stopPropagation();
    onRowClick(id);
  };

  const labelColor = ratingColors[rating] || ratingColors['default'];

  return (
    <TableRow hover={false} tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          disableRipple
          checked={selected}
          onChange={(event) => handleClick(event, title)}
        />
      </TableCell>

      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={title} src={poster} />
          <Link to={`/reviews/${id}`}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ cursor: 'pointer', color: 'DodgerBlue', textDecoration: 'underline' }}
              onClick={handleDetailClick}
            >
              {title}
            </Typography>
          </Link>
        </Stack>
      </TableCell>

      <TableCell sx={{ pointerEvents: 'none' }}>
        <Typography variant="subtitle2" noWrap>
          {genre}
        </Typography>
      </TableCell>

      <TableCell sx={{ pointerEvents: 'none' }}>
        <Label
          variant="outlined"
          color="default"
          sx={{
            borderColor: labelColor,
            color: labelColor,
            backgroundColor: 'transparent',
            fontSize: '1rem',
            padding: '0.3rem 0.8rem',
            height: '32px',
            border: `1px solid ${labelColor}`,
          }}
        >
          {rating}
        </Label>
      </TableCell>

      <TableCell sx={{ pointerEvents: 'none' }}>
        <Typography variant="subtitle2" noWrap>
          {runtime}
        </Typography>
      </TableCell>

      <TableCell sx={{ pointerEvents: 'none' }}>
        <Typography variant="subtitle2" noWrap>
          {releaseDate}
        </Typography>
      </TableCell>

      <TableCell sx={{ pointerEvents: 'none' }}>
        <Typography variant="subtitle2" noWrap>
          {language}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

ReviewTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  runtime: PropTypes.string.isRequired,
  releaseDate: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
};
