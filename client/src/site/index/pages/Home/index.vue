<script setup lang="ts">
import { useRouter } from 'vue-router';
import TestComponent from '@common/components/TestComponent.vue';
import useUserStore from '@index/store/user';

const router = useRouter();
const userStore = useUserStore();
const goAbout = () => {
  router.push('/about');
};
</script>

<template>
  <div>
    <div>Home</div>
    <div>name: {{ userStore.getUserInfo.name }}</div>
    <div>team: {{ userStore.getUserInfo.team }}</div>
    <el-button @click="goAbout">Go About</el-button>
    <TestComponent />
  </div>
</template>

<style scoped></style>
