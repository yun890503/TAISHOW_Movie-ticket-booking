import { Helmet } from 'react-helmet-async';

import { ReviewsView } from 'src/sections/reviews/view';

// ----------------------------------------------------------------------

export default function ReviewsPage() {
  return (
    <>
      <Helmet>
        <title> 評論審閱 | TaiShow </title>
      </Helmet>

      <ReviewsView />
    </>
  );
}
