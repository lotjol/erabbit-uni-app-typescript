<template>
  <cart></cart>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import cart from "./default.vue";

export default defineComponent({
  components: {
    cart,
  },
});
</script>

<style>
page {
  background-color: #f7f7f8;
  height: 100%;
}
</style>
