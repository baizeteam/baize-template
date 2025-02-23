<template>
  <div class="tool-bar">
    <div>baize chrome 工具栏</div>
    <el-button @click="handleClick">click me</el-button>
  </div>
  
</template>

<script setup lang="ts">
const handleClick = () => {
  ElMessage({
    message: "click me",
    type: "success",
  });
};
</script>

<style scoped>

</style>
