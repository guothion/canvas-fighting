<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
const canvasRef = ref<HTMLCanvasElement | null>(null);

const radToDeg = r => {
    return r / (Math.PI / 180)
  }

  const degToRad = d => {
    return (Math.PI / 180) * d
  }

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
            // ctx.fillRect(0, 0, 50, 50)
            // ctx.save();
            // ctx.translate(50, 50)
            // ctx.fillRect(0, 0, 50, 50)
            // ctx.restore();
            // // ctx.translate(-50, -50)
            // ctx.fillRect(25, 25, 50, 50)

            // ctx.fillRect(100, 100, 50, 50)
            // ctx.rotate(Math.PI / 4)
            // ctx.fillRect(100, 100, 50, 50)

            const a = degToRad(45)
            ctx.transform(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0)
            ctx.fillRect(100, 100, 50, 50)
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>