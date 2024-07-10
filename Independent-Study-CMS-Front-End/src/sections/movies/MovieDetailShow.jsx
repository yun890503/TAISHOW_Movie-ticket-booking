import { Modal, Box, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import './MovieDetailShow.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 860,
    maxHeight: 650,
    overflowY: 'auto',
    bgcolor: 'rgba(15, 15, 15, 0.75)',
    boxShadow: 24,
    p: 4,
    color: '#ccc',
  
    '&::-webkit-scrollbar': {
      width: 7,
    },
    '&::-webkit-scrollbar-button': {
      background: 'transparent',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-track-piece': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid slategrey',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'transparent',
    },
};

const MovieDetailShow = ({ show, onHide, data}) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadModal, setUploadModal] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDrop = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);
        if(droppedFiles && droppedFiles.length > 0) {
            const updatedFiles = [...files];
            const updatedPreviews = [...previews];

            updatedFiles[index] = droppedFiles[0];
            updatedPreviews[index] = URL.createObjectURL(droppedFiles[0]);

            setFiles(updatedFiles);
            setPreviews(updatedPreviews);
        }
    }

    // e.target.files => FileList
    // shallow => copies of the current files and previews
    const handleFileChange = (e, index) => {
        const selectedFiles = Array.from(e.target.files);
        if(selectedFiles && selectedFiles.length > 0) {
            const updatedFiles = [...files];
            const updatedPreviews = [...previews];

            updatedFiles[index] = selectedFiles[0];
            updatedPreviews[index] = URL.createObjectURL(selectedFiles[0]);

            setFiles(updatedFiles);
            setPreviews(updatedPreviews);
        } 
    };

    const handleModalClose = () => {
        setUploadModal(false);
    }

    const handleUpload = async (movieId) => {
        const uploadURL = 'http://localhost:8080/still/upload';
        const formData = new FormData();
        files.forEach((file) => {
            if(file){
                formData.append('files', file);
            }
        });
        formData.append('movieId', movieId);
        try {
            const res = await fetch(uploadURL, {
                method: 'POST',
                body: formData,
            })
            console.log(res);
            if(!res.ok){
                alert("請放圖片");
            } else {
                setUploadModal(true);
            }
        } catch (error) {
            console.error('上傳失敗: ', error)
        }
    }

    const formDate = (stringDate) => {
        return dayjs(stringDate).format('YYYY-MM-DD');
    }

    const putURL = 'http://localhost:8080/movie/updateMovie';
    const OutTheater = async (e) => {
        const id = e.currentTarget.id;
        try {
            const res = await axios.put(`${putURL}/${id}`);
            console.log(res.data);
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    }
    return(
        <Modal
            open={show}
            onClose={onHide}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography id="modal-title" variant="h3" component="h2" sx={{ fontFamily: 'LXGW WenKai TC', fontWeight: 'bold', color: '#ccc' }}>電影詳細資訊
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={onHide}>關閉</Button>
                    </Grid>
                </Grid>

                {data && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {data.map((movie) => (
                            <React.Fragment key={movie.id}>
                                <Grid item xs={4}>
                                    <img src={movie.poster} alt="" style={{width: '280px'}}/>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant='body2'>
                                        <div>電影名稱(中文): {movie.title}</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>電影名稱(英文): {movie.titleEnglish}</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>級別: {movie.rating}</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>類型: {movie.genre}</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>片長: {movie.runtime} 分鐘</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>導演: {movie.director}</div>
                                    </Typography>
                                    <Typography variant='body2'>
                                        <div>上映日期: {formDate(movie.releaseDate)}</div>
                                    </Typography>
                                    <hr style={{ borderTop: '0.1px solid #ccc', margin: '10px 0' }} />
                                    <Typography variant='body2'>
                                        <div>簡介: {movie.synopsis}</div>
                                    </Typography>
                                    <hr style={{ borderTop: '0.1px solid #ccc', margin: '10px 0' }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent="center">
                                        {[0, 1, 2].map((index) => (
                                            <Grid item key={index}>
                                                <div
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, index)}
                                                    style={{
                                                        width: '250px',
                                                        height: '250px',
                                                        margin: '10px 0 0 0',
                                                        border: '3px dashed #ccc',
                                                        borderRadius: '10px',
                                                        padding: '5px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <input type='file'
                                                        onChange={(e) => handleFileChange(e, index)}
                                                        style={{ display: 'none' }}
                                                        id={`fileInput-${index}`} />
                                                    <label htmlFor={`fileInput-${index}`}
                                                        style={{ cursor: 'pointer' }}>點擊或拖曳上傳
                                                    </label>
                                                    {previews[index] && (
                                                        <div>
                                                            <img
                                                                src={previews[index]}
                                                                alt={`Preview ${index + 1}`}
                                                                style={{
                                                                    maxWidth: '200px', maxHeight: '200px', margin: '5px',
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent="space-between">
                                        <Grid item>
                                            <Button id={movie.id} onClick={OutTheater} disabled={movie.isOutTheater}>下檔</Button>
                                        </Grid>
                                        <Grid item>
                                            <Button onClick={() => handleUpload(movie.id)}>上傳圖片</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                )}

                <Dialog
                    open={uploadModal}
                    onClose={handleModalClose}
                    aria-labelledby="success-dialog-title"
                    aria-describedby="success-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="success-dialog-description" className='dialog-content-text'>
                            圖片上傳成功
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose} className='dialog-button' autoFocus>
                            關閉
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal>
    )
}

export default MovieDetailShow