<template>
    <div class="full-page">
        <canvas ref="canvasRef" ></canvas>
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import text from "./textarticle.js";
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
            const padding = 20 // 内边距
            const pageWidth = canvasWidth - padding * 2 // 画布减去内边距可用的宽度作为页面宽度
            // 计算行数据
            const computeRowData = data => {
                const rows:any[] = [] // 行数组
                let curRow:any[] = [] // 当前行
                let curRowTotalWidth = 0 // 当前行当前的总宽度
                data.forEach(item => {
                    // 遇到换行符，那么直接新开一行
                    if (item.value === '\n') {
                        rows.push(curRow)
                        curRow = []
                        curRowTotalWidth = 0
                        return
                    }
                    // 测量文本宽高
                    ctx.save()
                    ctx.font = getFont(item.format || {})
                    const textMetrics = ctx.measureText(item.value)
                    ctx.restore()
                    const width =
                        textMetrics.actualBoundingBoxLeft + textMetrics.actualBoundingBoxRight
                    const height =
                        textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent
                    // 将源信息和宽高信息一起保存起来
                    const itemData = {
                        ...item,
                        width,
                        height
                    }
                    // 如果加上当前字符的宽度依旧小于页面宽度，那么可以继续追加到当前行中
                    if (curRowTotalWidth + width <= pageWidth) {
                        curRow.push(itemData)
                        // 更新当前行的总宽度
                        curRowTotalWidth += width
                    } else {
                        // 否则需要创建新行
                        rows.push(curRow)
                        curRow = [itemData]
                        curRowTotalWidth = width
                    }
                })
                return rows
            }

            // 拼接字体属性
            const getFont = ({
                fontSize = 16,
                fontFamily = '楷体, 楷体_GB2312, SimKai, STKaiti',
                fontWeight = '',
                fontStyle = ''
            } = {}) => {
                return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
            }

            
            const drawRow = rows => {
                let totalRowHeight = padding
                ctx.save()
                ctx.textBaseline = 'bottom'
                rows.forEach((row, index) => {
                    console.log(getRowMaxTextHeight);
                    // 当前行所有字符高度的最大值
                    const maxRowTextHeight = getRowMaxTextHeight(row)
                    // 当前行所有字符行高的最大值
                    const maxRowLineHeight = getRowMaxLineHeight(row)
                    // 字符高度 * 行高 得到该行实际高度
                    const rowHeight = maxRowTextHeight * maxRowLineHeight
                    // ...
                    totalRowHeight += rowHeight// 更新所有行的总高度
                    // 当前行所有字符的y坐标
                    const y = totalRowHeight + maxRowTextHeight + (rowHeight - maxRowTextHeight) / 2
                    // 当前行已绘制字符的总宽度
                    let curRowTotalWidth = padding

                    const textAlign = getRowTextAlign(row)
                    // 居中对齐
                    if (textAlign === 'center') {
                        const rowTotalWidth = getRowTotalWidth(row)
                        curRowTotalWidth = padding + (pageWidth - rowTotalWidth) / 2
                    } else if (textAlign === 'right') {
                        // 右对齐
                        const rowTotalWidth = getRowTotalWidth(row)
                        curRowTotalWidth = padding + (pageWidth - rowTotalWidth)
                    }


                    row.forEach(text => {
                        const x = curRowTotalWidth

                        ctx.save()
                        if (text.format) {
                        // 字体样式
                        ctx.font = getFont(text.format)
                        }
                        if (text.format) {
                            // ...
                            if (text.format.color) ctx.fillStyle = text.format.color
                            if (text.format.backgroundColor) {
                                ctx.save()
                                ctx.fillStyle = text.format.backgroundColor
                                ctx.fillRect(x, totalRowHeight, text.width, rowHeight)
                                ctx.restore()
                            }
                            // 下划线
                            if (text.format.textDecoration === 'underline') {
                                ctx.save()
                                ctx.beginPath()
                                ctx.moveTo(x, totalRowHeight + rowHeight)
                                ctx.lineTo(x + text.width, totalRowHeight + rowHeight)
                                ctx.stroke()
                                ctx.restore()
                            }
                            // 删除线
                            if (text.format.textDecoration === 'line-through') {
                                ctx.save()
                                ctx.beginPath()
                                ctx.moveTo(x, totalRowHeight + rowHeight / 2)
                                ctx.lineTo(x + text.width, totalRowHeight + rowHeight / 2)
                                ctx.stroke()
                                ctx.restore()
                            }
                        }
                        ctx.fillText(text.value, x,  y)
                        ctx.restore()


                        // ...
                        curRowTotalWidth += text.width
                    })
                })
                ctx.restore()
            }

            const textss = computeRowData(text);
            console.log(textss);
            drawRow(textss)


            
            
        }
    }
});



// 获取行所有字符高度的最大值
const getRowMaxTextHeight = row => {
    let res = 0
    row.forEach(item => {
        if (item.height > res) {
            res = item.height
        }
    })
    return res
}

// 获取行所有字符行高的最大值
const getRowMaxLineHeight = row => {
    let res = 0
    row.forEach(item => {
        if (item.format && item.format.lineHeight > res) {
            res = item.format.lineHeight
        }
    })
    return res === 0 ? 1.5 : res
}

const getRowTextAlign = row => {
    let res = 'left'
    row.forEach(item => {
        if (item.format && item.format.textAlign) {
            res = item.format.textAlign
        }
    })
    return res
}

const getRowTotalWidth = row => {
    return row.reduce((sum, cur) => {
        return (sum += cur.width)
    }, 0)
}
</script>

<style scoped>
canvas{
    border: 1px solid #333;
}
</style>