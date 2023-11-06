<template>
  <div class="tab">
    <router-link
      :to="tab.path"
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
    >
      <span class="tab-link">{{ tab.name }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "tab",
  data() {
    return {
      tabs: [
        {
          name: "推荐",
          path: "/recommend",
        },
        {
          name: "歌手",
          path: "/singer",
        },
        {
          name: "排行",
          path: "/top-list",
        },
        {
          name: "搜索",
          path: "/search",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.tab {
  display: flex;
  height: 44px;
  font-size: var(--m-font-size-medium);
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-link {
      color: var(--m-color-theme);
      padding-bottom: var(--m-space-1);
    }
    &.router-link-active .tab-link {
      border-bottom: 2px solid var(--m-color-theme);
    }
  }
}
</style>
