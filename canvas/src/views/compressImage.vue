<template>
  <div class="full-page">
    <canvas ref="canvasRef" ></canvas>
    <button @click="useQuality(0.5)">下载图片（质量下降）</button>
    <button @click="useScale({targetWidth: 300})">下载图片（尺寸缩小）</button>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue';
import demoImage from "../assets/pexels-hatice-baran-153179658-27596282.jpg";
import { downloadImage } from "../utils/utils";
let canvas: HTMLCanvasElement;
// let quality = 0.2;

const canvasRef = ref<HTMLCanvasElement | null>(null);
let init: any;
onMounted(() => {
  if(canvasRef.value) {
    canvas = canvasRef.value;
    init = (width: number, height: number) => {
      const ratio = window.devicePixelRatio
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      return ctx;
    }
  }
});
function useQuality(quality:number) {
  const image = new Image();

  image.onload = function() {
    let ctx = init(image.width,image.height);
    ctx.drawImage(image,0,0);
    const data = canvas.toDataURL('image/jpeg',quality);
    downloadImage(data,'测试图片'+new Date().getTime()+'.jpeg');
  }
  image.src = demoImage;
}

interface target {
  targetWidth?: number,
  targetHeight?: number,
}

function useScale({targetWidth,targetHeight}:target): void {
  const img = new Image();
  img.onload = function() {
    // 原图的比例
    const imgRatio = img.width / img.height
    // 提供了目标的宽度
    if(targetWidth !== undefined) {
      if (img.width > targetWidth) {
        // 根据原图比例计算目标高度
        targetHeight = targetWidth / imgRatio
      }
    } else if(targetHeight !== undefined) {
      if (img.height > targetHeight) {
        targetWidth = targetHeight * imgRatio
      }
    }
    const ctx = init(targetWidth, targetHeight)
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    const imgData = canvas.toDataURL('image/jpeg')
    downloadImage(imgData, '图片.jpeg')
  }
  img.src = demoImage;
}

</script>

<style scoped>
canvas{
  border: 1px solid #333;
}
</style>