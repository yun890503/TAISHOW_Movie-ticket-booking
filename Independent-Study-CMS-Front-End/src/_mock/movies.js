import axios from "axios";

export const fetchMovie = async () => {
  try{
    const res = await axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=40b365a3')
    return res.Search;
  }catch(error){
    console.error('Error fetching user data:', error);
    return[];
  }
}

export const getMovies = (movies) => {
  
}