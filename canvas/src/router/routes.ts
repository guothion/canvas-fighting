
const routes: any[] = [
    {
        path: '/',
        name: 'home',
        meta: { title: 'canvas图表' },
        component: () => import('../views/chart.vue')
    },
];


export default routes;