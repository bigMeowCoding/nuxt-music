<template>
  <div class="header">
    <span class="icon" />
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {},
};
</script>

<style lang="scss">
.header {
  display: flex;
  height: 44px;
  justify-content: center;
  align-items: center;
  color: var(--m-color-theme);
  .icon {
    display: inline-block;
    width: 30px;
    height: 32px;
    //background-image: url("./logo@2x.png");
    @include bg-image("./logo");
    background-size: contain;
    margin-right: var(--m-space-1);
  }
  .text {
    font-size: var(--m-font-size-large);
  }
}
</style>
