import { useState,useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import NewMovies from '../NewMovies';
import MovieSearch from '../MovieSearch';
import MovieLayout from '../movieLayout';
import Cookies from 'js-cookie';

export default function MoviesView() {
  const [listShow, setListShow] = useState(false);
  const [moviesComing, setMoviesComing] = useState([]);
  const [moviesRelease, setMoviesRelease] = useState([]);
  const COMING_URL = 'http://localhost:8080/movie/getMovie/isComing'
  const RELEASE_URL = 'http://localhost:8080/movie/getMovie/isPlaying'

  const searchMovies = async () => {
      const token = Cookies.get('token');
      if(!token){
          alert("無使用權限");
          return;
      }
      try {
          const res = await fetch(COMING_URL, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          const dataComing = await res.json();

          // 使用 Array.isArray 檢查 API 返回的數據是否為陣列，否則設置為空陣列
          setMoviesComing(Array.isArray(dataComing.data) ? dataComing.data : []);

          const response = await fetch(RELEASE_URL, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          // response 的內容類型是 JSON => 使用 response.json()解析
          const dataRelease = await response.json();
          setMoviesRelease(Array.isArray(dataRelease.data) ? dataRelease.data: []);
      } catch (error) {
          console.error("Error fetching movies", error);
          setMoviesComing([]);
          setMoviesRelease([]);
      }
  }
  useEffect(() => {
      searchMovies();
  }, [])

  const addMovie = (newMovie) => {
      if (newMovie.isPlaying) {
          setMoviesRelease((prev) => [...prev, newMovie]);
      } else {
          setMoviesComing((prev) => [...prev, newMovie]);
      }
  }

  // 新增電影按鈕在此層
  const handleOpen = () => {
    setListShow(true);
  }

  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">院線更新</Typography>
        <Button variant="contained" color="inherit" 
                startIcon={<Iconify icon="eva:plus-fill" />} 
                onClick={handleOpen}>新增電影
        </Button>
      </Stack>
      
      {listShow && (
        <NewMovies 
          show= {listShow}
          onHide={() => setListShow(false)}
          onAddMovie={addMovie}
          state="showing" 
        />
      )}

      <MovieSearch 
        moviesComing={moviesComing}
        moviesRelease={moviesRelease}/>
      
      {/* <MovieLayout /> */}

    </Container>
  );
}
