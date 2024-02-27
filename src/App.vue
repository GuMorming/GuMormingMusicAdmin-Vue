<template>
  <el-config-provider :locale="zhCn" :size="size">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import useStore from '@/store';
import {ElConfigProvider} from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import type {EpPropMergeType} from "element-plus/es/utils/vue/props/types";
import {computed, onMounted} from 'vue';
import {report} from "./api/report";

const {app} = useStore();
const size = computed(() => app.size as EpPropMergeType<StringConstructor, "default" | "small" | "large", never>);

onMounted(() => {
  // 绿色 linear-gradient(to right, #25aae1, #40e495);
  // 紫色 linear-gradient(to right, #6253e1, #852D91);
  console.log(
      "%c Hello %c By GuMorming %c",
      "background:linear-gradient(to right, #6253e1, #852D91); padding: 1px; border-radius: 3px 0 0 3px;  color: #fff; padding:5px 0;",
      "background:linear-gradient(to right, #25aae1, #40e495); padding: 1px; border-radius: 0 3px 3px 0;  color: #000; padding:5px 0;",
      "background:transparent"
  );
  // TODO
  report();
});
</script>