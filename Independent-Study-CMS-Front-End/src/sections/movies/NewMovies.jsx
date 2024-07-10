import { useState } from 'react'
import classes from './NewMovies.module.css'
import axios from 'axios';
import { Modal } from '@mui/material';

function NewMovies({ show, onHide, onAddMovie }){

    const [title, setTitle] = useState('');
    const [titleEnglish, setTitleEnglish] = useState('');
    const [rating, setRating] = useState('');
    const [runtime, setRuntime] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [director, setDirector] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [language, setLanguage] = useState('');
    const [trailer, setTrailer] = useState('');
    const [poster, setPoster] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    function titleChangeHandler(e){
        setTitle(e.target.value);
    }
    function titleEnglishChangeHandler(e){
        setTitleEnglish(e.target.value);
    }
    function ratingChangeHandler(e){
        setRating(e.target.value);
    }
    function runtimeChangeHandler(e){
        setRuntime(e.target.value);
    }
    function genreChangeHandler(e){
        setGenre(e.target.value);
    }
    function releaseDateChangeHandler(e){
        setReleaseDate(e.target.value);
    }
    function directorChangeHandler(e){
        setDirector(e.target.value);
    }
    function synopsisChangeHandler(e){
        setSynopsis(e.target.value);
    }
    function languageChangeHandler(e){
        setLanguage(e.target.value);
    }
    function trailerChangeHandler(e){
        setTrailer(e.target.value);
    }
    function posterChangeHandler(e){
        // 注意: file格式傳輸 e.target.files[0]
        const file = e.target.files[0];
        getBase64(file);
        setIsPlaying(false);
    }

    const onLoad = fileString => {
        console.log(fileString);
        setPoster(fileString)
    }
    // 上傳圖片前預覽: 透過 FileReader 或者 createObjectURL，讓瀏覽器自己生成顯示媒體的網址。
    const getBase64 = file =>{
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            onLoad(reader.result);
        }
        reader.onerror = error => console.log('Error', error);
    }

    const postURL = 'http://localhost:8080/movie/createMovie';
    async function submitHandler(e) {
         // 阻止表單送出
        e.preventDefault();
        
        // 所有參數都必須包含在form submission => submitHandlers
        // 即使是 isPlaying 預設值=false 都必須放入包含在FormData
        const formData = new FormData();
        formData.append('title', title);
        formData.append('titleEnglish', titleEnglish);
        formData.append('rating', rating);
        formData.append('runtime', runtime);
        formData.append('genre', genre);
        formData.append('releaseDate', releaseDate);
        formData.append('director', director);
        formData.append('synopsis', synopsis);
        formData.append('language', language);
        formData.append('trailer', trailer);
        formData.append('poster', poster);
        formData.append('isPlaying', isPlaying);
        
        try {
            // GET、POST、HEAD => 不帶自定義 Header => 視為簡單請求
            // Content-Type: {application/x-www-form-urlencoded、multipart/form-data、text/plain}
            const response = await axios.post(postURL, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log(response);
            onAddMovie(response.data);
            onHide(); 
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal
            open={show}
            onClose={onHide}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <form className={classes.form} onSubmit={submitHandler}>
                <h2>新增電影</h2>
                <p>
                    <label htmlFor="title">中文電影名稱</label>
                    <input type="text" onChange={titleChangeHandler} />
                </p>
                <p>
                    <label htmlFor="title">英文電影名稱</label>
                    <input type="text" onChange={titleEnglishChangeHandler} />
                </p>
                <p>
                    <label htmlFor="rating">電影級別</label>
                    <select onChange={ratingChangeHandler} >
                        <option value="">選擇級別</option>
                        <option value="普通級">普通級</option>
                        <option value="保護級">保護級</option>
                        <option value="輔12級">輔12級</option>
                        <option value="輔15級">輔15級</option>
                        <option value="限制級">限制級</option>
                    </select>
                </p>
                <p>
                    <label htmlFor="runtime">影片長度</label>
                    <input type="text" onChange={runtimeChangeHandler} />
                </p>
                <p>
                    <label htmlFor="genre">影片類型</label>
                    <select onChange={genreChangeHandler} >
                        <option value="">選擇類型</option>
                        <option value="動作片">動作片</option>
                        <option value="冒險片">冒險片</option>
                        <option value="動畫片">動畫片</option>
                        <option value="喜劇片">喜劇片</option>
                        <option value="犯罪片">犯罪片</option>
                        <option value="戲劇片">戲劇片</option>
                        <option value="奇幻故事片">奇幻故事片</option>
                        <option value="歷史片">歷史片</option>
                        <option value="恐怖片">恐怖片</option>
                        <option value="懸疑片">懸疑片</option>
                        <option value="哲學片">哲學片</option>
                        <option value="政治片">政治片</option>
                        <option value="愛情片">愛情片</option>
                        <option value="科幻片">科幻片</option>
                        <option value="驚悚片">驚悚片</option>
                    </select>
                </p>
                <p>
                    <label htmlFor="releaseDate">上映日期</label>
                    <input type="date" onChange={releaseDateChangeHandler} />
                </p>
                <p>
                    <label htmlFor="director">導演</label>
                    <input type="text" onChange={directorChangeHandler} />
                </p>
                <p>
                    <label htmlFor="synopsis">簡介</label>
                    <input type="text" onChange={synopsisChangeHandler} />
                </p>
                <p>
                    <label htmlFor="language">語言</label>
                    <select onChange={languageChangeHandler} >
                        <option value="">選擇語言</option>
                        <option value="Chinese">中文</option>
                        <option value="English">英文</option>
                        <option value="Japanese">日文</option>
                    </select>
                </p>
                <p>
                    <label htmlFor="trailer">預告片</label>
                    <input type="text" onChange={trailerChangeHandler}/>
                </p>
                <p>
                    <label htmlFor="poster">劇照</label>
                    <input type="file" onChange={posterChangeHandler} required/>
                </p>
                <p className={classes.actions}>
                    <button type='button' onClick={onHide}>取消</button>
                    <button type='submit'>確認新增</button>
                </p>
            </form>
        </Modal>
    )
}

export default NewMovies