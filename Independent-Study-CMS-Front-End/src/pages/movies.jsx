import { Helmet } from 'react-helmet-async';

import { MoviesView } from 'src/sections/movies/view';

export default function MoviesPage() {
  return (
    <>
      <Helmet>
        <title> 院線更新 | TaiShow </title>
      </Helmet>

      <MoviesView />
    </>
  );
}
