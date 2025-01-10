<template>
    <div class="full-page">
        <canvas ref="canvasRef"></canvas>
        <div>
            <button @click="handleTab(1)">黑白</button>
            <button @click="handleTab(2)">灰度</button>
            <button @click="handleTab(3)">高斯模糊</button>
            <button @click="handleTab(4)">马赛克</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const canvasRef = ref<HTMLCanvasElement | null>(null);
import imageUrl from "@/assets/a55d57f30191e.png";

let ctx: any = ref();
let canvas: HTMLCanvasElement;
interface ImageData {
    data: any;
    width: number;
    height: number;
    colorSpace: string;
}
const canvasWidth = 550;
const canvasHeight = 550;
const ratio = Math.max(window.devicePixelRatio, 2);
let image = new Image();

onMounted(() => {
    if (canvasRef.value) {
        canvas = canvasRef.value;
        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";
        ctx = canvas.getContext("2d");

        if (ctx) {
            image.onload = function () {
                // 绘制整个画布的大小
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = imageUrl;
        }
    }
});

function blackWhite(imageData: any) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        // const ava = imageData.data[i+3];
        const ava = (r + g + b) / 3; // 我们获取当前颜色的平均值
        // 如果平均值大于一半，说明是深色，我们渲染黑色，否则渲染白色
        if (ava > 127) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 255;
        } else {
            imageData.data[i] = 0;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
        }
    }
}

function grey(imageData: any) {
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const ava = (r + g + b) / 3;
        imageData.data[i] = ava;
        imageData.data[i + 1] = ava;
        imageData.data[i + 2] = ava;
    }
}

const getImageData = (sx: number, sy: number, sw: number, sh: number) => {
    console.log(sx * ratio, sy * ratio, sw * ratio, sh * ratio);
    return ctx.getImageData(sx * ratio, sy * ratio, sw * ratio, sh * ratio);
};

const putImageData = (
    imageData: any,
    dx: number,
    dy: number,
    ox = 0,
    oy = 0,
    ow: any,
    oh: any
) => {
    ow = ow === undefined ? imageData.width : ow * ratio;
    oh = oh === undefined ? imageData.height : oh * ratio;
    ctx.putImageData(
        imageData,
        dx * ratio,
        dy * ratio,
        ox * ratio,
        oy * ratio,
        ow,
        oh
    );
};

function handleTab(tab: number) {
    ctx.save();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imageData = getImageData(0, 0, canvasWidth, canvasWidth);
    console.log(tab);
    switch (tab) {
        case 1:
            blackWhite(imageData);
            break;
        case 2:
            grey(imageData);
            break;
        case 3:
            blur(imageData);
            break;
        case 4:
            mosaic(imageData);
        default:
            break;
    }
    putImageData(imageData, 0, 0, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
}

const _radius = ref(10);
function blur(imageData: any) {
    const sigma = 10;
    const radius = Number(_radius.value);
    // 计算权重矩阵
    const weightList = [];
    let weightSum = 0; // 权重总和
    for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
            // 根据二维正态分布函数计算
            const res =
                (1 / (2 * Math.PI * sigma * sigma)) *
                Math.exp(-(i * i + j * j) / (2 * sigma * sigma));
            weightList.push(res);
            weightSum += res;
        }
    }
    for (let i = 0; i < weightList.length; i++) {
        weightList[i] /= weightSum;
    }
    // 遍历每个像素点
    const width = imageData.width;
    const height = imageData.height;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let r = 0;
            let g = 0;
            let b = 0;
            // 遍历周边像素
            let weightIndex = 0;
            for (let i = -radius; i <= radius; i++) {
                let nx = x + i;
                if (nx < 0 || nx >= width) {
                    nx = x + -i;
                }
                for (let j = -radius; j <= radius; j++) {
                    let ny = j + y;
                    if (ny < 0 || ny >= height) {
                        ny = y + -j;
                    }
                    // 对应的权重
                    const weight = weightList[weightIndex++];
                    // 当前周围的像素点
                    const nindex = ny * width * 4 + nx * 4;
                    // 像素点的每个通道都和权重相乘，并且累加
                    r += imageData.data[nindex] * weight;
                    g += imageData.data[nindex + 1] * weight;
                    b += imageData.data[nindex + 2] * weight;
                }
            }
            // 修改当前中心点像素
            const index = y * width * 4 + x * 4;
            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
        }
    }
}

// 马赛克
function mosaic(imageData: any) {
    // 遍历每个像素点
    const width = imageData.width;
    const height = imageData.height;
    const size = 10; // 马赛克块的大小
    for (let x = 0; x < width; x += size) {
        for (let y = 0; y < height; y += size) {
            let r = 0;
            let g = 0;
            let b = 0;
            let count = 0;
            // 遍历当前马赛克块内的像素
            for (let i = 0; i < size; i++) {
                const nx = x + i;
                for (let j = 0; j < size; j++) {
                    const ny = y + j;
                    // 当前像素点
                    const nindex = ny * width * 4 + nx * 4;
                    // 计算总和
                    r += imageData.data[nindex];
                    g += imageData.data[nindex + 1];
                    b += imageData.data[nindex + 2];
                    // 计算数量
                    count++;
                }
            }
            // 计算平均值
            const ra = r / count;
            const ga = g / count;
            const ba = b / count;
            // 更新当前马赛克块的像素
            for (let i = 0; i < size; i++) {
                const nx = x + i;
                for (let j = 0; j < size; j++) {
                    const ny = y + j;
                    const nindex = ny * width * 4 + nx * 4;
                    imageData.data[nindex] = ra;
                    imageData.data[nindex + 1] = ga;
                    imageData.data[nindex + 2] = ba;
                }
            }
        }
    }
}
</script>

<style scoped>
canvas {
    border: 1px solid #333;
}
</style>
