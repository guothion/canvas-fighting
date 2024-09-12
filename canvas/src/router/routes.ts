
const routes: any[] = [
    {
        path: '/demo',
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
    {
        path: '/image',
        name: 'image',
        meta: { title: '图像' },
        component: () => import('../views/image.vue')
    },
    {
        path: '/html',
        name: 'html',
        meta: { title: '将DOM节点转换为图片' },
        component: () => import('../views/html.vue')
    },
    {
        path: '/compress-image',
        name: 'compressImage',
        meta: { title: '压缩图片' },
        component: () => import('../views/compressImage.vue')
    },
    {
        path: '/enlarge',
        name: 'enlarge',
        meta: { title: '放大镜' },
        component: () => import('../views/enlarge.vue')
    },
];


export default routes;