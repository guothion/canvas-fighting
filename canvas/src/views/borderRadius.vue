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
            /**
             * @description: 使用 arc 方法绘制
             * @param {*} x
             * @param {*} y
             * @param {*} width
             * @param {*} height
             * @param {*} borderRadius
             * @return {*}
             */            
            const createRoundedRect = (x:number,y:number,width:number,height:number,borderRadius:number) => {
                ctx.beginPath();

                // 上 
                ctx.moveTo(x+borderRadius,y);
                ctx.lineTo(x+width-borderRadius,y);

                // 右
                // 绘制圆弧
                ctx.arc(x+width-borderRadius,y+borderRadius,borderRadius,3* Math.PI/2,0);
                ctx.lineTo(x+width, y+height-borderRadius)

                // 下
                ctx.arc(x+width-borderRadius,y+height-borderRadius,borderRadius,0,Math.PI/2);
                ctx.lineTo(x+borderRadius,y+height)

                // 左
                ctx.arc(x+borderRadius,y+height-borderRadius,borderRadius,Math.PI/2,Math.PI);
                ctx.lineTo(x,y+borderRadius)
                ctx.arc(x+borderRadius,y+borderRadius,borderRadius,Math.PI,Math.PI*3/2);

                ctx.stroke();

            }

            // createRoundedRect(100,100,300,300,80);

            const createRoundedRect2 = (x:number,y:number,width:number,height:number,borderRadius:number) => {
                ctx.beginPath();

                // 上 
                ctx.moveTo(x+borderRadius,y);
                ctx.lineTo(x+width-borderRadius,y);

                // 右
                // 绘制圆弧
                ctx.quadraticCurveTo(x+width,y,x+width,y+borderRadius);
                ctx.lineTo(x+width, y+height-borderRadius)

                // 下
                ctx.quadraticCurveTo(x+width,y+height,x+width-borderRadius,y+height);
                ctx.lineTo(x+borderRadius,y+height)

                // 左
                ctx.quadraticCurveTo(x,y+height,x,y+height-borderRadius);
                ctx.lineTo(x,y+borderRadius)
                ctx.quadraticCurveTo(x,y,x+borderRadius,y);

                ctx.stroke();
            }

            createRoundedRect2(100,100,300,300,80);
        }
    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>