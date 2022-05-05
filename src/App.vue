<template>
  <div class="container">
    <h1 class="display-1 text-center">ScreenShoter</h1>

    <div class="container">
      <div class="col-col-md-4" v-for="image in images" :key="image.id">
        <img src="image.src" alt="screenshot">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      images: []
    }
  }
}
</script>
