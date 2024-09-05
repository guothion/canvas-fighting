<template>
    <div class="slide-wrapper">
        <a-menu
            v-model:openKeys="state.openKeys"
            v-model:selectedKeys="state.selectedKeys"
            mode="inline"
            theme="dark"
            :items="items"
            @click="navigateTo"
        ></a-menu>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import routes from "@/router/routes";
import { useRouter } from "vue-router";

const state = reactive({
  selectedKeys: ['demo'],
  openKeys: ['demo'],
});

const router = useRouter();

const routes_list = routes.map(item => {
    return {
        title: item.meta.title,
        label: item.meta.title,
        key: item.name,
        path: item.path
    }
})
const items = reactive(routes_list);


function navigateTo(route:any):void {
  router.push(route.item.path);
}
</script>

<style scoped>
.slide-wrapper{
    height: 100%;
}
</style>