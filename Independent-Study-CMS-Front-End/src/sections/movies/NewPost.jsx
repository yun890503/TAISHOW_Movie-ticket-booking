function NewPost(){
    return(
        <form>
            <p>
                <label htmlFor="title">電影名稱</label>
                <input type="text" name="title" />
            </p>
            <p>
                <select name="rating" id="rating">
                    <option value="general">普通級</option>
                    <option value="protected">保護級</option>
                    <option value="pg12">輔12級</option>
                    <option value="pg15">輔15級</option>
                    <option value="restricted">限制級</option>
                </select>
            </p>
            <p>
                <label htmlFor="runtime">影片長度</label>
                <input type="text" name="runtime" />
            </p>
            <p>
                <select name="genre" id="genre">
                    <option value="action">動作片</option>
                    <option value="adventure">冒險片</option>
                    <option value="animation">動畫片</option>
                    <option value="comedy">喜劇片</option>
                    <option value="crime">犯罪片</option>
                    <option value="drama">戲劇片</option>
                    <option value="fantasy">奇幻故事片</option>
                    <option value="historical">歷史片</option>
                    <option value="horror">恐怖片</option>
                    <option value="mystery">懸疑片</option>
                    <option value="philosophical">哲學片</option>
                    <option value="political">政治片</option>
                    <option value="romance">愛情片</option>
                    <option value="science-fiction">科幻片</option>
                    <option value="thriller">驚悚片</option>
                </select>
            </p>
            <p>
                <label htmlFor="releaseDate">上映日期</label>
                <input type="date" name="releaseDate" />
            </p>
            <p>
                <label htmlFor="director">導演</label>
                <input type="text" name="director" />
            </p>
            <p>
                <label htmlFor="synopsis">簡介</label>
                <input type="textarea" name="synopsis" />
            </p>
            <p>
                <select name="language" id="language">
                    <option value="chinese">中文</option>
                    <option value="english">英文</option>
                    <option value="japanese">日文</option>
                </select>
            </p>
            <p>
                <label htmlFor="trailer">預告片</label>
                <input type="file" name="trailer" />
            </p>
            <p>
                <label htmlFor="postUrl">劇照</label>
                <input type="file" name="postUrl" />
            </p>

        </form>
    )
}

export default NewPost