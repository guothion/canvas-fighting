<template>

    <a-layout class="layout">
        <a-layout-sider :style="siderStyle">
            <Slide />
        </a-layout-sider>
        <a-layout>
            <a-layout-header :style="headerStyle">
                <Header />
            </a-layout-header>
            <a-layout-content :style="contentStyle">
                <RouterView />
            </a-layout-content>
            <a-layout-footer :style="footerStyle">
                <Footer />
            </a-layout-footer>
        </a-layout>
    </a-layout>

</template>

<script setup lang="ts">
import Slide from "./slide.vue";
import Header from "./header.vue";
import Footer from "./footer.vue";
import { RouterView } from "vue-router";

import type { CSSProperties } from 'vue';
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#333',
  backgroundColor: '#fefefe',
};

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
//   backgroundColor: '#3ba0e9',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#333',
};


</script>

<style scoped>
.layout{
    min-height: 100%;
}
</style>