import React, { useState } from 'react'
import axios from 'axios';
import MovieDetailShow from './MovieDetailShow';

const MovieCardSearch = ({movie}) => {
    const getURL = 'http://localhost:8080/movie/getMovie'
    const [detailShow, setDetailShow] = useState(false);
    const [movieData, setMovieData] = useState('');
    const imghandler = async (e) => {
        const id = e.target.id;
        const res = await axios.get(`${getURL}/${id}`);
        console.log(res.data.data);
        setDetailShow(true);
        setMovieData(res);
    }

    // 檢查 poster 是否為有效 base64字符
    // str.split(',')[1] => 取陣列中第二個元素
    // atob 解碼 base64格式字串 => btoa 對二進制資料重新編碼成base64
    const isValidBase64 = (src) => {
        if(src == 'N/A') return false;
        try {
            return btoa(atob(str.split(',')[1])).length > 0;
        } catch (error) {
            return false;
        }
    }

    const posterSrc = movie.poster ? movie.poster : 'https://via.placeholder.com/400';

    return (
    <div>
        {detailShow && (
            <MovieDetailShow 
                show = {detailShow}
                onHide={() => setDetailShow(false)}
                data={movieData}
            />
        )}
        <div className='movie'>
            <div>
                <p>{movie.releaseDate}</p>
            </div>
            <div>
                <img id={movie.id} src={posterSrc} alt={movie.title} onClick={imghandler}/>
            </div>
            <div>
                <span>{movie.genre}</span>
                <h3>{movie.title}</h3>
            </div>
        </div>
    </div>
    )
}

export default MovieCardSearch