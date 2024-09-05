<template>
    <div class="slide-wrapper">
        <a-menu
            v-model:openKeys="state.openKeys"
            v-model:selectedKeys="state.selectedKeys"
            mode="inline"
            theme="dark"
            :items="items"
        ></a-menu>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, h } from 'vue';
import routes from "@/router/routes";

const state = reactive({
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
const routes_list = routes.map(item => {
    return {
        title: item.meta.title,
        label: item.meta.title,
        key: item.name,
        path: item.path
    }
})
const items = reactive(routes_list);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);
</script>

<style scoped>
.slide-wrapper{
    height: 100%;
}
</style>