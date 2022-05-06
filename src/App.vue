<template>
  <div class="container">
    <h1 class="display-1 text-center">ScreenShoter</h1>
    <h2 class="display-2 text-center">{{ timer < 0 ? 'saving...' : timer }}</h2>

    <div class="container">
      <div class="row">
        <div class="col-md-3 my-3 mx-3" v-for="(image, index) in images" :key="index">
          <img width="300" :src="image.src" alt="screenshot" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      images: [],
      timer: 5
    };
  },
  created() {
    this.images = Array.from(window.electronAPI.images);
    window.electronAPI.onScreenCapture((_event, image) => {
      this.images.push(image);
    });

    setInterval(() => {
      this.timer--;

      if(this.timer <= -4) {
        this.timer = 5;
      }
    }, 500);
  },
};
</script>
