<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
        <div>
            <button @click="handleExportBlob">导出图片blob</button>
            <button @click="handleExportDataUrl">导出图片url-data</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
const canvasRef = ref<HTMLCanvasElement | null>(null);
import imageUrl from "@/assets/pexels-hatice-baran-153179658-27596282.jpg";

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
            const image = new Image();
            image.onload = function() {
                ctx.drawImage(image,0,0,canvas.width,canvas.height);
            }
            image.src = imageUrl;
        }

        
    }
});
function handleExportDataUrl() {
    let res = canvas.toDataURL('image/png',1);
    console.log(res);
    downloadImage(res,'data-image')
}
function handleExportBlob() {
    console.log(ctx,canvas);
    canvas.toBlob(function(res) {
        console.log(res);
        downloadBlob(res,'blob-image');
    },'image/png',1)
}

function downloadBlob(data:any='',fileName:string='测试') {
    const downloadElement = document.createElement("a");
    // 创建下载的链接
    const href = window.URL.createObjectURL(data);
    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
}
function downloadImage(data:any='',fileName:string='测试') {
    const downloadElement = document.createElement("a");
    // 创建下载的链接
    downloadElement.href = data;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
}
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
</style>