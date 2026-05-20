<template>
  <div class="app-shell">
    <RouterView />
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/Footer.vue'
</script>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  color: #1f2937;
  background: #f8fafc;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-shell {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}
</style>