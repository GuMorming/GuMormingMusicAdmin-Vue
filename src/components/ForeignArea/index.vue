<template>
  <el-cascader size="large"
               clearable
               ref="cascader"
               :options="foreignArea"
  >
  </el-cascader>
</template>

<script setup lang="ts">
import {foreignArea} from "./data";
</script>

<style>
.groupBlue {
  background-color: #00355d;

  width: 170px;
}

.selectBlue .el-input .el-input__inner {
  background-color: #00355d;
  border: none;
  width: 170px;
}

.groupBlack {
  width: 170px;
}

.selectBlack .el-input .el-input__inner {
  border: none;
  width: 170px;
}

.groupWhite {
  background-color: #d9d9d9;
  width: 170px;
}

.selectWhite .el-input .el-input__inner {
  border: none;
  background-color: #d9d9d9;
  width: 170px;
}
</style>