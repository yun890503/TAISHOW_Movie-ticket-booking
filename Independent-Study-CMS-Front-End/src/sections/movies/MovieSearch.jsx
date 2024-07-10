import React, { useState } from 'react'
import MovieCardSearch from './MovieCardSearch'
import './Movies.css'

const MovieSearch = ({ moviesComing, moviesRelease }) => {
    const [showComingSoon, setShowComingSoon] = useState(true);

    return (
        <div className='app'>
            <div onClick={() => setShowComingSoon(!showComingSoon)}>
                <h3>{showComingSoon ? '即將上映' : '上映中'}</h3>
            </div>
            {showComingSoon ? (
                // 通常是某些屬性 undefined 或 null => 導致訪問 length 時發生錯誤
                moviesComing.length > 0 ?
                (
                    <div className='container'>
                        {
                            moviesComing.map((movie, index) => (
                                <MovieCardSearch key={index} movie={movie} />
                            ))
                        }

                    </div>
                ) : (
                    <div className='empty'>
                        <h2>查無電影</h2>
                    </div>
                )
            ) : (
                moviesRelease.length > 0 ?
                (
                    <div className='container'>
                        {
                            moviesRelease.map((movie, index) => (
                                <MovieCardSearch key={index} movie={movie} />
                            ))
                        }

                    </div>
                ) : (
                    <div className='empty'>
                        <h2>查無電影</h2>
                    </div>
                )
            )}
        </div>
    )
}

export default MovieSearch