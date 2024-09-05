
const routes: any[] = [
    {
        path: '/',
        name: 'demo',
        meta: { title: 'demo' },
        component: () => import('../views/demo.vue')
    },
    {
        path: '/eraser',
        name: 'eraser',
        meta: { title: '橡皮擦实现' },
        component: () => import('../views/eraser.vue')
    },
];


export default routes;