import tinycolor from "tinycolor2";
import Launcher from "./launcher";
// 烟花类
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

export default Firework;