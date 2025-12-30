


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


export default Launcher;