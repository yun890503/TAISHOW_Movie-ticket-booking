import React, { useEffect, useState } from 'react'
import "./Movies.css"
import MovieCard from './MovieCard'
import { Modal, Box, Typography, Button  } from '@mui/material'

// By ID or Title ?i => A valid IMDb ID (e.g. tt1285016)
// Please note while both "i" and "t" are optional at least one argument is required.
const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=40b365a3'
const ICON_URL = 'https://gist.githubusercontent.com/adrianhajdin/997a8cdf94234e889fa47be89a4759f1/raw/f13e5a9a0d1e299696aa4a0fe3a0026fa2a387f7/search.svg'

const MovieLayout = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchMovies = async (title) => {
    // &s => 	Movie title to search for
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
  }

  useEffect(() => {
    searchMovies({searchTerm});
  }, []);

  // 拿取資料 => 待製作:顯示電影資訊視窗 + 可編輯/刪除按鈕
  const openModal = (movie) => {
    setSelectedMovie(movie); 
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMovie(null);
  }

  return (
    <div>
      <div className='search'>
        <input value={searchTerm} 
          placeholder='搜尋電影' 
          onChange={(e) => setSearchTerm(e.target.value)}/>

        <img src={ICON_URL} alt='serach' 
          onClick={() => searchMovies(searchTerm)}/>
      </div>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            bgcolor: 'background.paper', 
            border: '2px solid #000', 
            boxShadow: 24, 
            p: 4 
          }}
        >
          <Typography variant="h6" component="h2">
            {selectedMovie?.Title}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            There is nothing can show
          </Typography>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Modal >

      {movies.length > 0 ? (
          <div className='container' >
            {movies.map((movie, index) => (
              // why it can't open the Modal
              <MovieCard key={index} movie={movie} onClick={() => openModal(movie)}/>
            ))}
          </div>

        ) : (
          <div className='empty'>
            <h2>No movie found</h2>
          </div>    
      )}

    </div>
  )
}

export default MovieLayout