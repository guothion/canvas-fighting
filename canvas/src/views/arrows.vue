<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import { degToRad, radToDeg } from "../utils/utils";
const canvasRef = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
    if(canvasRef.value) {
        const canvas = canvasRef.value;
        const canvasWidth = 250
        const canvasHeight = 250
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        const ctx = canvas.getContext('2d');
        if(ctx) {
            const drawArrow = (x:number,y:number,tx:number,ty:number, deg:number, l:number) => {
                const A = radToDeg(Math.atan2(ty-y,tx -x));
                const B = deg - A;

                const l1 = l * Math.sin(degToRad(B));
                const l2 = l * Math.cos(degToRad(B));
                const x1 = tx - l2;
                const y1 = ty + l1;

                const B2 = 90 - A - deg;
                const x2 = tx - l * Math.sin(degToRad(B2))
                const y2 = ty - l * Math.cos(degToRad(B2));

                ctx.beginPath();
                ctx.moveTo(x,y)
                ctx.lineTo(tx,ty);

                ctx.moveTo(tx,ty);
                ctx.lineTo(x1,y1);

                ctx.moveTo(tx,ty)
                ctx.lineTo(x2,y2);

                ctx.stroke();
            }
        
            drawArrow(30,30,200,200,30,30);
        }

    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>