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
        const canvasWidth = 550
        const canvasHeight = 550
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        const ctx = canvas.getContext('2d');
        if(ctx) {
            const drawRegularPolygon = (n:number, x:number, y:number, r:number) => {
                ctx.beginPath()
                const a = (Math.PI * 2) / n
                for (let i = 0; i < n; i++) {
                    const dx = Math.cos(a * i) * r
                    const dy = Math.sin(a * i) * r
                    const tx = x + dx
                    const ty = y + dy
                    ctx.lineTo(tx, ty)
                }
                ctx.closePath()
                ctx.stroke()
            }
            // drawRegularPolygon(8, 500, 500, 300)

            const drawRegularPolygon2 = (n:number, x:number, y:number, r:number) => {
                const a = (Math.PI * 2) / n
                ctx.beginPath()
                ctx.translate(x, y)
                for (let i = 0; i < n; i++) {
                    if (i === 0) {
                        ctx.moveTo(r, 0)
                    } else {
                        ctx.rotate(a)
                        ctx.lineTo(r, 0)
                    }
                }
                ctx.closePath()
                ctx.stroke()
            }
            drawRegularPolygon2(8, 500, 500, 300)
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>