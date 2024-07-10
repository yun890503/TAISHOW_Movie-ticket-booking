import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: '院線更新',
    path: '/movies',
    icon: icon('ic_movies'),
  },
  {
    title: '會員列表',
    path: '/users',
    icon: icon('ic_users'),
  },
  {
    title: '紅利記錄',
    path: '/bonus',
    icon: icon('ic_bonus'),
  },
  {
    title: '購票記錄',
    path: '/payments',
    icon: icon('ic_payments'),
  },
  {
    title: '退票記錄',
    path: '/refunds',
    icon: icon('ic_refunds'),
  },
  {
    title: '評論審閱',
    path: '/reviews',
    icon: icon('ic_reviews'),
  },
];

export default navConfig;
