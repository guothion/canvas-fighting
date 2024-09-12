<template>
  <div class="full-page">
    <div id="imgBox">
      <img id="img" src="../assets/pexels-hatice-baran-153179658-27596282.jpg" />
      <div id="area"></div>
    </div>
      <canvas ref="canvasRef" ></canvas>
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

    let width = 500,height=500;
    canvas = canvasRef.value;
    // const ratio = window.devicePixelRatio
    const ratio = 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);

    const imgBox = document.getElementById('imgBox')
    const imgBoxRect = imgBox.getBoundingClientRect() // 尺寸和位置信息
    const imgBoxSize = imgBoxRect.width // 尺寸

    // 图片元素
    const img = document.getElementById('img')

    // 指示器元素
    const area = document.getElementById('area')
    const areaSize = 50 // 指示器元素的大小

    let isInImgBox = false
    imgBox.addEventListener('mouseover', () => {
      isInImgBox = true
      area.style.display = 'block'
    })
    imgBox.addEventListener('mousemove', e => {
      if (!isInImgBox) return
      // 转换鼠标位置，然后减去指示器元素大小的一半
      let left = e.clientX - imgBoxRect.left - areaSize / 2
      let top = e.clientY - imgBoxRect.top - areaSize / 2
      // 左边界限制
      left = Math.max(left, 0)
      // 右边界限制
      left = Math.min(left, imgBoxSize - areaSize)
      // 同理
      top = Math.max(top, 0)
      top = Math.min(top, imgBoxSize - areaSize)
      // 更新指示器位置
      area.style.left = left + 'px'
      area.style.top = top + 'px'

      const originWidth = img.naturalWidth// 图片原宽度
      const widthRatio = originWidth / imgBoxSize  // 原宽度和显示宽度的比值
      const originHeight = img.naturalHeight// 图片原高度
      const heightRatio = originHeight / imgBoxSize// 原高度和显示高度的比值
      // 将指示器元素的位置和大小根据比例缩放
      const sx = left * widthRatio
      const sy = top * heightRatio
      const sWidth = areaSize * widthRatio
      const sHeight = areaSize * heightRatio
      // 绘制到canvas上
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width*ratio, canvas.height*ratio)
    })
    imgBox.addEventListener('mouseleave', () => {
      isInImgBox = false
      area.style.display = 'none'
    })



  }
});


</script>

<style scoped>
canvas{
  border: 1px solid #333;
}

#imgBox {
  width: 200px;
  height: 200px;
  position: relative;
  overflow: hidden;
}
  img {
    width: 100%;
    height: 100%;
  }

  #area {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>