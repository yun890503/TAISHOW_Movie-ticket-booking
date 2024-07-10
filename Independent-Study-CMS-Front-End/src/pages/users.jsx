import { Helmet } from 'react-helmet-async';

import { UsersView } from 'src/sections/users/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> 會員資料 | TaiShow </title>
      </Helmet>

      <UsersView />
    </>
  );
}
