<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
        <div class="wrap">
            <div class="boxWrap">
                <div id="box"></div>
            </div>
            <button id="start" @click="beginMove">开始</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
const canvasRef = ref<HTMLCanvasElement | null>(null);
const box = document.getElementById('box')

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
        const padding  = 20// 内边距
        const contentWidth = canvasWidth - padding * 2// 实际可用宽高
        const contentHeight = canvasHeight - padding * 2

        // 当前按住的控制点
        let mousedownPoint = ''
        // 鼠标按下的坐标
        const mousedownPos = {
            x: 0,
            y: 0
        }
        // 当前按住的控制点此刻的坐标
        const mousedownPointPos = {
            x: 0,
            y: 0
        }

        const ctx = canvas.getContext('2d');

        const isPointInPath: (x:number, y:number) => boolean = (x,y) =>  {
            return ctx.isPointInPath(x * ratio, y * ratio)
        }
        const isPointInStroke = (x, y) => {
            return ctx.isPointInStroke(x * ratio, y * ratio)
        }

        const drawCircle = (x, y,color="#fff") => {
            ctx.save()
            ctx.beginPath()
            ctx.arc(x, y, 10, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }

        const drawLine = (x1, y1, x2, y2, color = '#000') => {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = color
            ctx.stroke()
            ctx.restore()
        }

        const drawInNewCoordSystem = fn => {
            ctx.save()
            // 修改坐标系
            ctx.translate(
                padding,
                padding + (contentHeight - contentWidth) / 2 + contentWidth
            )
            ctx.scale(1, -1)
            fn()
            ctx.restore()
        }

        const drawCirclePath = (x, y) => {
            ctx.beginPath()
            ctx.arc(x, y, 10, 0, Math.PI * 2)
        }

        if(ctx) {
            const p1 = {
                x: 0,
                y: contentWidth
            }
            const p2 = {
                x: contentWidth,
                y: 0
            }

            const draw = () => {
                // 清空画布
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)

                ctx.save()

                // 修改坐标系
                ctx.translate(padding, padding + contentWidth + (contentHeight - contentWidth) / 2)
                ctx.scale(1, -1)

                // 绘制坐标轴
                ctx.beginPath()
                ctx.moveTo(0, contentWidth)
                ctx.lineTo(0, 0)
                ctx.lineTo(contentWidth, 0)
                ctx.stroke()
                
                // 绘制起点和终点
                drawCircle(0, 0)
                drawCircle(contentWidth, contentWidth)

                // 绘制贝塞尔曲线
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, contentWidth, contentWidth)
                ctx.stroke()

                // 绘制控制点
                // 绘制控制点
                drawLine(p1.x, p1.y, 0, 0, '#ff0088')
                drawLine(p2.x, p2.y, contentWidth, contentWidth, '#00aabb')
                drawCircle(p1.x, p1.y, '#ff0088')
                drawCircle(p2.x, p2.y, '#00aabb')

                ctx.restore()
            }

            draw();

            const rect = canvas.getBoundingClientRect()
            const windowToCanvas = e => {
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                return {x, y}
            }

            canvas.addEventListener('mousedown', e => {
                let pos = windowToCanvas(e)
                mousedownPos.x = pos.x
                mousedownPos.y = pos.y

                drawInNewCoordSystem(() => {
                    // 控制点1的路径
                    drawCirclePath(p1.x, p1.y)
                    
                    console.log(pos,p1)
                    let isInPoint1 = isPointInPath(pos.x, pos.y)// isPointInPath为上一节中封装的方法
                    let isInPoint2 = false
                    if (!isInPoint1) {
                        // 控制点2的路径
                        drawCirclePath(p2.x, p2.y)
                        isInPoint2 = isPointInPath(pos.x, pos.y)
                    }
                    console.log(isInPoint1, isInPoint2,'--------------------------------')
                    if (isInPoint1) {
                        mousedownPointPos.x = p1.x
                        mousedownPointPos.y = p1.y
                        mousedownPoint = 'point1'
                    } else if (isInPoint2) {
                        mousedownPointPos.x = p2.x
                        mousedownPointPos.y = p2.y
                        mousedownPoint = 'point2'
                    }
                })
            })

            window.addEventListener('mousemove', e => {
                if (!mousedownPoint) return
                const pos = windowToCanvas(e)
                // 鼠标拖动的距离
                const dx = pos.x - mousedownPos.x
                const dy = pos.y - mousedownPos.y
                // 当前被拖拽控制点新的坐标
                let newX = mousedownPointPos.x + dx
                const newY = mousedownPointPos.y - dy

                newX = newX < 0 ? 0 : newX > contentWidth ? contentWidth : newX
                // 更新控制点坐标
                if (mousedownPoint === 'point1') {
                    p1.x = newX
                    p1.y = newY
                } else if (mousedownPoint === 'point2') {
                    p2.x = newX
                    p2.y = newY
                }
                // 重绘
                draw()
            })

            window.addEventListener('mouseup', () => {
                if (!mousedownPoint) return
                mousedownPoint = ''
                const x1 = (p1.x / contentWidth).toFixed(2)
                const y1 = (p1.y / contentWidth).toFixed(2)
                const x2 = (p2.x / contentWidth).toFixed(2)
                const y2 = (p2.y / contentWidth).toFixed(2)
                console.log(x1, y1, x2, y2)
                setCubicBezier(x1, y1, x2, y2)
            })
        }


        

        
    }
});

function beginMove() {
    const box = document.getElementById('box');
    if (box.classList.contains('move')) {
        box.classList.remove('move')
    } else {
        box.classList.add('move')
    }
}

function setCubicBezier (x1,y1,x2,y2) {
    const box = document.getElementById('box');
    box.style.transitionTimingFunction = `cubic-bezier(${x1},${y1},${x2},${y2})`;
}

</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
.boxWrap {
    width: 400px;
    height: 100px;
    position: relative;

}
#box {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: lightcoral;
    left: 0;
    top: 0;
    transition-property: left;
    transition-duration: 1s;
    transition-timing-function: ease-in-out;

}
#box.move {
    left: 300px;
}
</style>