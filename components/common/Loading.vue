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
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      console.log(this.loading);
      this.loading = true;
      console.log(this.loading);
    },
    finish() {
      console.log(this.loading);
      this.loading = false;
      console.log(this.loading);
    },
    fail() {
      console.log("Fail")
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
  background: rgba(255, 255, 255);
  text-align: center;
  font-size: 30px;
  font-family: sans-serif;
  z-index: 100000000;
}
</style>