<template>
  <div
    class="flex flex-col min-h-screen bg-[#F5F1E8] text-[#1C1C1C] font-sans antialiased selection:bg-[#2E7D32] selection:text-white"
  >
    <Navbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/src/components/common/Navbar.vue';
import Footer from '@/src/components/common/Footer.vue';
</script>
