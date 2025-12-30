<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
        <button id="launcherBtn">发射</button>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
const canvasRef = ref<HTMLCanvasElement | null>(null);
import easingFunctions from './easingFunctions'
import tinycolor from "tinycolor2";

onMounted(() => {
    if(canvasRef.value) {
        const canvas = canvasRef.value;
        const canvasWidth = 800
        const canvasHeight = 600
        const ratio = Math.max(window.devicePixelRatio,2);
        canvas.width = canvasWidth * ratio
        canvas.height = canvasHeight * ratio
        canvas.style.width = canvasWidth + 'px'
        canvas.style.height = canvasHeight + 'px'
        const launcherBtn = document.getElementById('launcherBtn');
        // 烟花列表
        const fireworkList = []
        

        const ctx = canvas.getContext('2d');
        if(ctx) {
            const drawCircle = ({ x, y, radius, color }) => {
                ctx.save()
                ctx.beginPath()
                ctx.arc(x, y, radius, 0, Math.PI * 2)
                ctx.fillStyle = color
                ctx.fill()
                ctx.restore()
            }
            const getRandom = (min, max) => {
                return Math.random() * (max - min) + min
            }

            const draw = () => {
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.save();
                // 修改坐标系
                ctx.translate(0, canvasHeight)
                ctx.scale(1, -1)

                fireworkList.forEach(firework => {
                    firework.update()
                })
                ctx.restore();

                window.requestAnimationFrame(draw);
            }
            draw();


            class Firework {
                constructor(opt = {}) {
                    // 颜色，tinycolor是一个颜色工具库
                    this.color = opt.color || tinycolor.random().toHexString()
                    // 发射器
                    this.launcher = null
                    // 爆炸器
                    this.explosive = null
                    // 烟花状态：waiting（等待发射）、launching（发射中）、bursting（爆炸中）、end（烟花结束）
                    this.status = 'waiting'
                }

                // 发射
                launch() {
                    this.launcher = new Launcher({
                        firework: this,
                        color: this.color
                    })
                    this.launcher.start()
                    this.status = 'launching'
                }

                // 爆炸
                burst() {

                }

                // 更新
                update() {
                    if (this.status === 'launching') {
                        const res = this.launcher.update()
                        if (res.isEnd) {
                            this.status = 'bursting'
                            this.burst(res)
                        }
                    }
                }
            }
            // 发射器类
            class Launcher {
                constructor(opt = {}) {
                    // 所属的烟花实例
                    this.firework = opt.firework
                    // 颜色
                    this.color = opt.color
                    // 初始位置
                    this.x = opt.x || canvasWidth * getRandom(0.2, 0.8)
                    this.y = opt.y || 0
                    // 目标位置
                    this.ty = canvasHeight * getRandom(0.6, 0.8)
                    // 半径
                    this.radius = opt.radius || getRandom(2, 5)
                    // 发射的持续时间
                    this.duration = opt.duration || getRandom(2000, 3500)
                    // 发射时的时间
                    this.startTime = 0
                }
                start() {
                    this.startTime = Date.now()
                }

                update() {
                    const x = this.x
                    let y = easingFunctions.easeOutCubic(
                        Date.now() - this.startTime,
                        this.y,
                        this.ty - this.y,
                        this.duration
                    )
                    y = Math.min(y, this.ty)
                    this.draw(x, y)
                    return {
                        x,
                        y,
                        isEnd: y >= this.ty //返回true代表发射结束
                    }
                }

                draw(x, y) {
                    // 外圆，烟花的颜色
                    drawCircle({
                        x: x,
                        y: y,
                        radius: this.radius,
                        color: this.color
                    })
                    // 内圆，白色
                    drawCircle({
                        x: x,
                        y: y,
                        radius: this.radius / 2,
                        color: '#fff'
                    })
                }
            }

            launcherBtn.addEventListener('click', () => {
                // ...
                const firework = new Firework()
                fireworkList.push(firework)
                firework.launch()
            })

            // 爆炸碎片类
            class ExplosiveDebris {
                constructor(opt) {
                    this.firework = opt.firework
                    this.x = opt.x
                    this.y = opt.y
                    this.color = Math.random() > 0.2 ? opt.color : '#fff'
                    this.radius = opt.radius || 2
                    this.angle = getRandom(0, 2 * Math.PI)
                    this.speed = opt.speed || getRandom(0.1, 4)
                    this.vx = Math.cos(this.angle) * this.speed
                    this.vy = Math.sin(this.angle) * this.speed
                    this.g = opt.g || 0.98
                    this.time = getRandom(0.5, 1)
                    this.startTime = 0
                }
                start() {
                    this.startTime = Date.now()
                }

                update() {
                    // 更新位置
                    const duration = (Date.now() - this.startTime) / 1000
                    const vy = this.vy - this.g * duration
                    this.x += this.vx
                    this.y += vy
                    // 更新透明度
                    const progress = duration / this.time
                    let opacity = progress > 0.7 ? 1 - 1 * progress : 1
                    if (opacity < 0) opacity = 0
                    // 绘制
                    drawCircle({
                        x: this.x,
                        y: this.y,
                        color: this.color,
                        radius: this.radius,
                        opacity: opacity
                    })
                    return {
                        x: this.x,
                        y: this.y,
                        isEnd: progress >= 1
                    }
                }
            }

            class Explosive {
                constructor(opt) {
                    this.firework = opt.firework
                    this.x = opt.x
                    this.y = opt.y
                    this.color = opt.color
                    // 爆炸碎片数量
                    this.debrisNum = opt.debrisNum || getRandom(50, 400)
                    // 爆炸碎片列表
                    this.debrisList = []
                }
                start(debrisNum, opt = {}) {
                    // 碎片数量、初始位置没有特别指定则使用爆炸器的数据
                    const num = debrisNum || this.debrisNum
                    opt.x = opt.x || this.x
                    opt.y = opt.y || this.y
                    // 创建指定数量的爆炸碎片
                    for (let i = 0; i < num; i++) {
                        const explosiveDebris = new ExplosiveDebris({
                            firework: this.firework,
                            color: this.color,
                            ...opt
                        })
                        explosiveDebris.start()
                        this.debrisList.push(explosiveDebris)
                    }
                }

                update() {
                    const list = [...this.debrisList]
                    list.forEach(debris => {
                        const res = debris.update()
                        if (res.isEnd) {
                            deleteFromList(this.debrisList, debris)
                        }
                    })
                    return {
                        isEnd: list.length <= 0
                    }
                }
            }
        }

        
    }

    
});


</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>