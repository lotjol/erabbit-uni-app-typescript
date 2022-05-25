<template>
  <result></result>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import result from "@/components/result/index.vue";

export default defineComponent({
  components: {
    result,
  },
});
</script>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.list {
  height: 100%;
}
</style>
