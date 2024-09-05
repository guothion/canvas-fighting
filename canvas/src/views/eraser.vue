<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import { windowToCanvas } from "@/utils/utils";
const canvasRef = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
    if(canvasRef.value) {

        // 监听事件
        let isMouseDown = false;
        const canvas = canvasRef.value;

        const canvasWidth = 500
        const canvasHeight = 500
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.fillStyle = 'red'
            ctx.fillRect(0, 0, 500, 300)
            ctx.strokeStyle = 'blue'
            ctx.strokeRect(210, 210, 400, 300)
            // ctx.clearRect(50, 50, 100, 100)
        }

        // 坐标转换
        const rect = canvas.getBoundingClientRect();
        canvas.addEventListener('mousedown',(e) => {
            isMouseDown = true;
        })
        window.addEventListener('mousemove',(e) => {
            if(!isMouseDown) return;
            const {ex,ey} = windowToCanvas(e,rect);
            console.log(ex,ey)
            if(ctx) {
                const x = ex - 25
                const y = ey - 25
                ctx.clearRect(ratio*x, ratio*y, 50, 50)
            }
        })
        window.addEventListener('mouseup', (e) => {
            isMouseDown = false;
        })
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>