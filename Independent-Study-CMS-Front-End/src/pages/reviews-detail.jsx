import { Helmet } from 'react-helmet-async';

import { ReviewsDetailView } from 'src/sections/reviews-detail/view';

// ----------------------------------------------------------------------

export default function ReviewDetailPage() {
  return (
    <>
      <Helmet>
        <title> 評論詳情 | TaiShow </title>
      </Helmet>

      <ReviewsDetailView />
    </>
  );
}
