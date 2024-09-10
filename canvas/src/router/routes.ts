
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
    {
        path: '/border-raduis',
        name: 'borderRadius',
        meta: { title: '圆角矩形' },
        component: () => import('../views/borderRadius.vue')
    },
    {
        path: '/arrows',
        name: 'arrows',
        meta: { title: '箭头' },
        component: () => import('../views/arrows.vue')
    },
    {
        path: '/signature',
        name: 'signature',
        meta: { title: '电子签名' },
        component: () => import('../views/signature.vue')
    },
];


export default routes;