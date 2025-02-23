<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div>
    <div>About</div>
    <el-button @click="goHome">Go Home</el-button>
  </div>
</template>

<style scoped></style>
