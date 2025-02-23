<script setup lang="ts">
const handleClick = () => {
  ElMessage({
    message: "click me",
    type: "success",
  });
};
</script>
<template>
  <div>
    <h1>baize chrome extension</h1>
    <el-button @click="handleClick">click me</el-button>
  </div>
</template>

<style scoped>

</style>

