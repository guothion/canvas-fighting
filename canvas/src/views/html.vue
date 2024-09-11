<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
        <div
            id="el"
            style="border: 1px solid lightcoral;
            padding: 10px;
            width: 250px;
            height: 250px;
            background-color: #fff;">
            <h1>foreignObject</h1>
            <p>
                SVG中的<span style="font-weight: bold; color: lightblue">foreignObject</span>
                元素允许包含来自不同的 XML 命名空间的元素。在浏览器的上下文中，很可能是
                <span style="background-color: lightseagreen; color: #fff">
                    XHTML / HTML
                </span>。
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx:any = ref();
let canvas: HTMLCanvasElement;

onMounted(() => {
    if(canvasRef.value) {
        canvas = canvasRef.value;
        const canvasWidth = 250
        const canvasHeight = 250
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        ctx = canvas.getContext('2d');
        if(ctx) {
            const el:any = document.getElementById('el')
            // 获取节点大小
            const rect = el?.getBoundingClientRect()
            // 克隆一份
            const clone: any = el.cloneNode(true)
            // 添加xhtml命名空间
            clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
            // 拼接svg字符串
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
            <foreignObject width="${rect.width}" height="${rect.height}">${clone.outerHTML}</foreignObject>
            </svg>`

            const blob = new Blob([svgStr], {
                type: 'image/svg+xml'
            })

            const reader = new FileReader()
            reader.onload = evt => {
                // evt.target.result
                console.log(evt);
                drawImage(evt.target.result);
            }
            reader.readAsDataURL(blob)

            function drawImage(svgUrl: any) {
                const img = new Image()
                img.onload = () => {
                    ctx.drawImage(img, 0, 0)
                }
                img.src = svgUrl
            }
        }

        
    }
});

</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
button{
    height: 40px;
    line-height: 40px;
    margin: 0 20px;
}
*{
    margin: 0;
    padding: 0;
    line-height: 1;
}
</style>