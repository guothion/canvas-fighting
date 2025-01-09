<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
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

        const isPointInPath: (x:number, y:number) => boolean = (x,y) =>  {
            return ctx.isPointInPath(x * ratio, y * ratio)
        }
        const isPointInStroke = (x, y) => {
            return ctx.isPointInStroke(x * ratio, y * ratio)
        }

        if(ctx) {
            // ctx.beginPath()
            // ctx.moveTo(20, 20)
            // ctx.lineTo(150, 20)
            // ctx.lineTo(150, 150)
            // ctx.lineTo(20, 150)
            // ctx.closePath()
            // ctx.stroke()
            // console.log(ctx.isPointInPath(250*ratio, 250*ratio))
            // console.log(ctx.isPointInPath(25*ratio, 25*ratio))

            // ctx.beginPath()
            // ctx.moveTo(100, 120)
            // ctx.lineTo(150, 130)
            // ctx.lineTo(170, 200)
            // ctx.stroke()
            // console.log(isPointInPath(140, 140))

            ctx.save()
            ctx.beginPath()
            ctx.moveTo(10, 10)
            ctx.lineTo(100, 10)
            ctx.lineCap = 'round'
            ctx.lineWidth = 20
            ctx.stroke()
            console.log(isPointInStroke(5, 10))
            ctx.restore()

            ctx.beginPath()
            ctx.moveTo(10, 10)
            ctx.lineTo(100, 10)
            ctx.lineWidth = 20
            ctx.strokeStyle = 'red'
            ctx.stroke()
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>