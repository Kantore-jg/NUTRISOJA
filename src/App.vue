<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { RouterView } from 'vue-router';
import ToastContainer from '@/src/components/common/ToastContainer.vue';
</script>
