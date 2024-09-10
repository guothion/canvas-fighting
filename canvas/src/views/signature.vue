<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import { windowToCanvas,getTwoPointDistance,average } from "../utils/utils";
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
        let isMouseDown = false;

        const ctx = canvas.getContext('2d');
        if(ctx) {
            // 方式一：
            // let lastPos = {
            //     ex: 0,
            //     ey: 0
            // }
            // const rect = canvas.getBoundingClientRect();
            // canvas.addEventListener('mousedown', e => {
            //     isMouseDown = true;
            //     lastPos = windowToCanvas(e,rect)
            // })
            // window.addEventListener('mousemove', e => {
            //     if(!isMouseDown) return;
            //     ctx.beginPath()
            //     ctx.moveTo(lastPos.ex*ratio, lastPos.ey*ratio)
            //     lastPos = windowToCanvas(e,rect)// 更新lastPos
            //     ctx.lineTo(lastPos.ex*ratio, lastPos.ey*ratio)
            //     ctx.lineWidth = 5
            //     ctx.stroke()
            // })
            // window.addEventListener('mouseup', (e) => {
            //     isMouseDown = false;
            // })


            // 方式二
            // let pointList = [];
            // const rect = canvas.getBoundingClientRect();
            // canvas.addEventListener('mousedown', e => {
            //     isMouseDown = true;
            //     pointList.push(windowToCanvas(e,rect));
            // })
            // window.addEventListener('mousemove', e => {
            //     if(!isMouseDown) return;
            //     pointList.push(windowToCanvas(e,rect));
            //     ctx.clearRect(0,0,canvas.width,canvas.height);
            //     ctx.beginPath()
            //     pointList.map(({ex,ey},index) => {
            //         if(index == 0) {
            //             ctx.moveTo(ex*ratio,ey*ratio);
            //         } else {
            //             ctx.lineTo(ex*ratio,ey*ratio);
            //         }
            //     })
            //     ctx.lineWidth = 5
            //     ctx.stroke()
            // })
            // window.addEventListener('mouseup', (e) => {
            //     isMouseDown = false;
            // })



            /***   开始优化   ***/ 

            // let pointList = [],lastPos = {ex:0,ey:0}
            // const rect = canvas.getBoundingClientRect();
            // canvas.addEventListener('mousedown', e => {
            //     isMouseDown = true;
            //     lastPos = windowToCanvas(e,rect);
            //     pointList.push(lastPos);
            // })
            // window.addEventListener('mousemove', e => {
            //     if(!isMouseDown) return;
            //     const curPos = windowToCanvas(e,rect);
            //     let distance = getTwoPointDistance(curPos.ex,curPos.ey,lastPos.ex,lastPos.ey);
            //     if(distance <= 4) {
            //         return;
            //     }
            //     lastPos = curPos;
            //     pointList.push(lastPos);
            //     ctx.clearRect(0,0,canvas.width,canvas.height);
            //     ctx.beginPath()
            //     pointList.map(({ex,ey},index) => {
            //         if(index == 0) {
            //             ctx.moveTo(ex*ratio,ey*ratio);
            //         } else {
            //             ctx.lineTo(ex*ratio,ey*ratio);
            //         }
            //     })
            //     ctx.lineWidth = 5
            //     ctx.stroke()
            // })
            // window.addEventListener('mouseup', (e) => {
            //     isMouseDown = false;
            // })


            // 最终版本
            let points:Array<any> = [],lastPos = {ex:0,ey:0}
            const rect = canvas.getBoundingClientRect();
            canvas.addEventListener('mousedown', e => {
                isMouseDown = true;
                lastPos = windowToCanvas(e,rect);
                points.push(lastPos);
            })
            window.addEventListener('mousemove', e => {
                if(!isMouseDown) return;
                const curPos = windowToCanvas(e,rect);
                let distance = getTwoPointDistance(curPos.ex,curPos.ey,lastPos.ex,lastPos.ey);


                if(distance <= 4) {
                    return;
                }
                lastPos = curPos
    
                points.push(lastPos)
                const len = points.length
                // 点位数量小于4个不处理
                if (len < 4) {
                    return
                }
                // 上一个控制点
                const lastControlPoint = {
                    x: 0,
                    y: 0
                }
                // 上一个终点
                const lastEndPoint = {
                    x: 0,
                    y: 0
                }
                let a = points[0]
                let b = points[1]
                const c = points[2]

                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                ctx.beginPath()
                ctx.moveTo(a.x, a.y)

                // 记录控制点和终点
                lastControlPoint.x = b.ex
                lastControlPoint.y = b.ey
                lastEndPoint.x = average(b.ex, c.ex)// average是一个计算平均值的方法
                lastEndPoint.y = average(b.ey, c.ey)

                ctx.quadraticCurveTo(
                    lastControlPoint.x*ratio,
                    lastControlPoint.y*ratio,
                    lastEndPoint.x*ratio,
                    lastEndPoint.y*ratio
                )

                for (let i = 2, max = len - 1; i < max; i++) {
                    a = points[i]
                    b = points[i + 1]
                    // 更新控制点和终点
                    lastControlPoint.x =
                        lastEndPoint.x + (lastEndPoint.x - lastControlPoint.x)
                    lastControlPoint.y =
                        lastEndPoint.y + (lastEndPoint.y - lastControlPoint.y)
                    lastEndPoint.x = average(a.ex, b.ex)
                    lastEndPoint.y = average(a.ey, b.ey)
                    ctx.quadraticCurveTo(
                        lastControlPoint.x*ratio,
                        lastControlPoint.y*ratio,
                        lastEndPoint.x*ratio,
                        lastEndPoint.y*ratio
                    )
                }
                
                ctx.lineWidth = 5
                ctx.stroke()
            })
            window.addEventListener('mouseup', (e) => {
                isMouseDown = false;
            })
        }

    }
});
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>