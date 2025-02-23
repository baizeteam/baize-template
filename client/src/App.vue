<template>
  <div>
    <div>this is a vue vsc extension</div>
    <el-button @click="handleClick">click me</el-button>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  ElMessage.success('click me');
};
</script>

<style scoped lang="less">
</style>

