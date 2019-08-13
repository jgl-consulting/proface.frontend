<template>
  <div v-if="loading" class="loading-page">
    <v-layout 
      align-content-center
      justify-center 
      fill-height 
      wrap 
      row >
      <v-progress-circular
        :size="50"
        color="accent"
        indeterminate
      ></v-progress-circular>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
    fail() {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 30px;
  font-family: sans-serif;
  z-index: 100000000;
}
</style>