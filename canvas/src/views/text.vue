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
        const canvasWidth = 500
        const canvasHeight = 500
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'

        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.beginPath()
            ctx.moveTo(0, canvas.height / 2)
            ctx.lineTo(canvas.width, canvas.height / 2)
            ctx.stroke()

            // 文本
            ;['alphabetic', 'top', 'hanging', 'middle', 'ideographic', 'bottom'].forEach(
                (item, index) => {
                    ctx.textBaseline = item
                    ctx.fillText('abg我一二三123', 100 * index, canvasHeight / 2)
                }
            )

            const getFont = ({
                fontSize = 16,
                fontFamily = '楷体, 楷体_GB2312, SimKai, STKaiti',
                fontWeight = '',
                fontStyle = ''
            } = {}) => {
                return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
            }
            ctx.font = getFont({
                fontStyle: 'italic',
                fontWeight: 'bold'
            })

            ctx.fillText('Canvas实战', 100, 100)

            ctx.textAlign = 'center'
            ctx.fillText('Canvas实战', 100, 120)

            ctx.textAlign = 'right'
            ctx.fillText('Canvas实战', 100, 140)

            const textMetrics = ctx.measureText('文本')
            console.log(textMetrics.width)
            console.log(textMetrics.actualBoundingBoxLeft);
            console.log(textMetrics)
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>