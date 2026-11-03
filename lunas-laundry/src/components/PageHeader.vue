<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: {
    type: String,
    default: "stars",
  },
});
</script>

<template>
  <div class="page-hero">
    <div>
      <div class="eyebrow">LUNAS / Laundry Order & Administration System</div>
      <h2>{{ title }}</h2>
      <p>{{ subtitle }}</p>
      <slot />
    </div>

    <div class="hero-symbol">
      <i :class="'bi bi-' + icon"></i>
    </div>
  </div>
</template>
