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
        if(ctx) {
            ctx.scale(ratio,ratio);
            ctx.fillStyle = 'blue';
            ctx.fillRect(0,0,200,200)
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>